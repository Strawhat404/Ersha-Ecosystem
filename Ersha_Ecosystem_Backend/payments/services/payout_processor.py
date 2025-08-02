import asyncio
from decimal import Decimal
from typing import Dict, Any, Optional
from django.utils import timezone
from ..models import PayoutRequest, EscrowAccount, Transaction
from .chapa import ChapaService
from .base import BasePaymentService

class PayoutProcessor(BasePaymentService):
    """Service for processing payout requests"""
    
    def __init__(self, api_key: str = None):
        super().__init__(api_key)
        self.chapa_service = ChapaService(api_key)
    
    async def process_payout_request(self, payout_request_id: str) -> Dict[str, Any]:
        """Process a payout request through Chapa"""
        try:
            payout_request = PayoutRequest.objects.get(id=payout_request_id)
            
            # Validate payout request
            validation_result = self._validate_payout_request(payout_request)
            if not validation_result['success']:
                return validation_result
            
            # Update status to processing
            payout_request.status = 'processing'
            payout_request.save()
            
            # Get payment method details
            payment_method = payout_request.payment_method
            
            # Process based on payment method type
            if payment_method.method_type == 'bank':
                result = await self._process_bank_payout(payout_request, payment_method)
            elif payment_method.method_type == 'mobile':
                result = await self._process_mobile_payout(payout_request, payment_method)
            else:
                result = {
                    'success': False,
                    'error': f'Unsupported payment method type: {payment_method.method_type}'
                }
            
            # Update payout request based on result
            if result['success']:
                payout_request.status = 'completed'
                payout_request.processed_at = timezone.now()
                payout_request.external_reference = result.get('reference', '')
            else:
                payout_request.status = 'failed'
                payout_request.notes = result.get('error', 'Payout processing failed')
            
            payout_request.save()
            
            return result
            
        except PayoutRequest.DoesNotExist:
            return {
                'success': False,
                'error': 'Payout request not found'
            }
        except Exception as e:
            return {
                'success': False,
                'error': f'Payout processing error: {str(e)}'
            }
    
    def _validate_payout_request(self, payout_request: PayoutRequest) -> Dict[str, Any]:
        """Validate payout request before processing"""
        try:
            # Check if payout request is pending
            if payout_request.status != 'pending':
                return {
                    'success': False,
                    'error': f'Payout request is not pending (current status: {payout_request.status})'
                }
            
            # Check escrow account balance
            escrow_account = EscrowAccount.objects.get(
                user_id=payout_request.user_id,
                is_active=True
            )
            
            if escrow_account.balance < payout_request.amount:
                return {
                    'success': False,
                    'error': f'Insufficient balance. Available: {escrow_account.balance}, Requested: {payout_request.amount}'
                }
            
            # Check payment method
            payment_method = payout_request.payment_method
            if not payment_method.is_verified:
                return {
                    'success': False,
                    'error': 'Payment method is not verified'
                }
            
            if not payment_method.is_active:
                return {
                    'success': False,
                    'error': 'Payment method is not active'
                }
            
            return {'success': True}
            
        except EscrowAccount.DoesNotExist:
            return {
                'success': False,
                'error': 'No active escrow account found'
            }
    
    async def _process_bank_payout(self, payout_request: PayoutRequest, payment_method) -> Dict[str, Any]:
        """Process bank account payout through Chapa"""
        try:
            # Extract bank details from payment method
            account_number = payment_method.account_number
            account_name = payment_method.account_name
            bank_name = payment_method.bank_name
            
            # Map bank name to Chapa bank code (you'll need to implement this mapping)
            bank_code = self._get_chapa_bank_code(bank_name)
            if not bank_code:
                return {
                    'success': False,
                    'error': f'Bank {bank_name} not supported by Chapa'
                }
            
            # Generate reference
            reference = f"PAYOUT-{payout_request.id}-{int(timezone.now().timestamp())}"
            
            # Initiate payout through Chapa
            result = await self.chapa_service.initiate_payout(
                amount=payout_request.amount,
                currency=payout_request.currency,
                account_number=account_number,
                account_name=account_name,
                bank_code=bank_code,
                reference=reference
            )
            
            if result['success']:
                # Deduct from escrow account
                escrow_account = EscrowAccount.objects.get(
                    user_id=payout_request.user_id,
                    is_active=True
                )
                escrow_account.balance -= payout_request.amount
                escrow_account.save()
                
                # Create transaction record
                Transaction.objects.create(
                    transaction_id=f"TXN-{reference}",
                    transaction_type='withdrawal',
                    amount=payout_request.amount,
                    currency=payout_request.currency,
                    status='completed',
                    sender_id=payout_request.user_id,
                    receiver_id=payout_request.user_id,
                    sender_name=f"Escrow Account",
                    receiver_name=account_name,
                    description=f"Payout to {bank_name} account",
                    payment_method=payment_method,
                    payment_provider='chapa',
                    external_transaction_id=result.get('transfer_id', ''),
                    external_reference=reference,
                    completed_at=timezone.now()
                )
            
            return result
            
        except Exception as e:
            return {
                'success': False,
                'error': f'Bank payout processing error: {str(e)}'
            }
    
    async def _process_mobile_payout(self, payout_request: PayoutRequest, payment_method) -> Dict[str, Any]:
        """Process mobile money payout"""
        # Mobile money payouts would require different implementation
        # For now, return not implemented
        return {
            'success': False,
            'error': 'Mobile money payouts not implemented yet'
        }
    
    def _get_chapa_bank_code(self, bank_name: str) -> Optional[str]:
        """Map bank name to Chapa bank code"""
        # This is a simplified mapping - you'll need to implement the actual mapping
        # based on Chapa's supported banks
        bank_mapping = {
            'Commercial Bank of Ethiopia': 'CBE',
            'Awash Bank': 'AWASH',
            'Dashen Bank': 'DASHEN',
            'Bank of Abyssinia': 'BOA',
            # Add more banks as needed
        }
        
        return bank_mapping.get(bank_name)
    
    async def verify_payout_status(self, payout_request_id: str) -> Dict[str, Any]:
        """Verify payout status through Chapa"""
        try:
            payout_request = PayoutRequest.objects.get(id=payout_request_id)
            
            if not payout_request.external_reference:
                return {
                    'success': False,
                    'error': 'No external reference found for payout'
                }
            
            # Verify through Chapa
            result = await self.chapa_service.verify_payout(payout_request.external_reference)
            
            if result['success']:
                # Update payout request status based on Chapa response
                chapa_status = result.get('status', '')
                
                if chapa_status == 'success':
                    payout_request.status = 'completed'
                    payout_request.processed_at = timezone.now()
                elif chapa_status == 'failed':
                    payout_request.status = 'failed'
                    payout_request.notes = 'Payout failed according to Chapa'
                
                payout_request.save()
            
            return result
            
        except PayoutRequest.DoesNotExist:
            return {
                'success': False,
                'error': 'Payout request not found'
            }
    
    async def get_supported_banks(self) -> Dict[str, Any]:
        """Get list of banks supported by Chapa"""
        return await self.chapa_service.get_banks()
    
    def calculate_processing_fee(self, amount: Decimal) -> Decimal:
        """Calculate processing fee for payout"""
        # Implement fee calculation logic
        # This could be a percentage or fixed amount
        if amount <= Decimal('1000'):
            return Decimal('10.00')  # Fixed fee for small amounts
        else:
            return amount * Decimal('0.01')  # 1% for larger amounts 