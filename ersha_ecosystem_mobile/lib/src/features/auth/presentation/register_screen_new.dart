// lib/src/features/auth/presentation/register_screen.dart
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:iconsax/iconsax.dart';
import 'package:provider/provider.dart';
import '../provider/auth_provider.dart';

class RegisterScreen extends StatefulWidget {
  final VoidCallback onSwitchToLogin;

  const RegisterScreen({Key? key, required this.onSwitchToLogin}) : super(key: key);

  @override
  _RegisterScreenState createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _formKey = GlobalKey<FormState>();
  bool _showPassword = false;
  bool _showConfirmPassword = false;
  bool _isLoading = false;
  String? _errorMessage;
  String? _successMessage;

  // Form fields
  String _email = '';
  String _password = '';
  String _confirmPassword = '';
  String _firstName = '';
  String _lastName = '';
  String _phone = '';
  String _username = '';
  String _userType = 'farmer';
  String _location = '';
  String _region = '';
  String _farmSize = '';
  String _businessLicense = '';

  final List<Map<String, dynamic>> _userTypes = [
    {
      'id': 'farmer',
      'label': 'Farmer',
      'icon': Iconsax.tree,
      'description': 'Grow and sell your agricultural products'
    },
    {
      'id': 'buyer',
      'label': 'Buyer',
      'icon': Iconsax.shop,
      'description': 'Purchase agricultural products and supplies'
    }
  ];

  final List<String> _regions = [
    'Addis Ababa', 'Oromia', 'Amhara', 'SNNPR', 'Tigray', 
    'Afar', 'Somali', 'Benishangul-Gumuz', 'Gambella', 'Harari'
  ];

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              Colors.green.shade50,
              Colors.teal.shade50,
              Colors.cyan.shade50,
            ],
          ),
        ),
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 32),
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 400),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  // Header
                  Column(
                    children: [
                      Container(
                        width: 80,
                        height: 80,
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            colors: [
                              Colors.green.shade500,
                              Colors.teal.shade600,
                            ],
                          ),
                          borderRadius: BorderRadius.circular(40),
                        ),
                        child: const Icon(
                          Iconsax.people,
                          size: 40,
                          color: Colors.white,
                        ),
                      ),
                      const SizedBox(height: 24),
                      Text(
                        'Join Ersha-Ecosystem',
                        style: theme.textTheme.headlineMedium?.copyWith(
                          fontWeight: FontWeight.bold,
                          color: Colors.grey.shade900,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'Create your account and start your agricultural journey',
                        style: theme.textTheme.bodyMedium?.copyWith(
                          color: Colors.grey.shade600,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 32),

                  // Form Container
                  Container(
                    padding: const EdgeInsets.all(24),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(24),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.grey.withOpacity(0.1),
                          blurRadius: 20,
                          spreadRadius: 5,
                        ),
                      ],
                      border: Border.all(color: Colors.grey.shade100),
                    ),
                    child: SingleChildScrollView(
                      child: Form(
                        key: _formKey,
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          crossAxisAlignment: CrossAxisAlignment.stretch,
                          children: [
                            _buildUserTypeSelection(theme),
                            const SizedBox(height: 24),
                            _buildNameFields(theme),
                            const SizedBox(height: 16),
                            _buildPhoneField(theme),
                            const SizedBox(height: 16),
                            _buildUsernameField(theme),
                            const SizedBox(height: 20),
                            _buildRegionField(theme),
                            const SizedBox(height: 16),
                            if (_userType == 'farmer') _buildFarmSizeField(theme),
                            if (_userType == 'buyer') _buildBusinessLicenseField(theme),
                            _buildEmailField(theme),
                            const SizedBox(height: 16),
                            _buildPasswordFields(theme),
                            const SizedBox(height: 24),
                            _buildErrorSuccessMessages(theme),
                            _buildSubmitButton(theme),
                          ],
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 24),
                  _buildLoginLink(theme),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildUserTypeSelection(ThemeData theme) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'I am a:',
          style: theme.textTheme.bodyMedium?.copyWith(
            fontWeight: FontWeight.w500,
            color: Colors.grey.shade700,
          ),
        ),
        const SizedBox(height: 12),
        Row(
          children: _userTypes.map((userType) {
            final isSelected = _userType == userType['id'];
            return Expanded(
              child: Container(
                margin: const EdgeInsets.only(right: 8),
                child: InkWell(
                  onTap: () {
                    setState(() {
                      _userType = userType['id'];
                    });
                  },
                  borderRadius: BorderRadius.circular(12),
                  child: Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: isSelected ? Colors.green.shade50 : Colors.grey.shade50,
                      border: Border.all(
                        color: isSelected ? Colors.green.shade300 : Colors.grey.shade200,
                        width: 2,
                      ),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Column(
                      children: [
                        Icon(
                          userType['icon'],
                          size: 32,
                          color: isSelected ? Colors.green.shade600 : Colors.grey.shade600,
                        ),
                        const SizedBox(height: 8),
                        Text(
                          userType['label'],
                          style: theme.textTheme.bodyMedium?.copyWith(
                            fontWeight: FontWeight.w600,
                            color: isSelected ? Colors.green.shade700 : Colors.grey.shade700,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          userType['description'],
                          textAlign: TextAlign.center,
                          style: theme.textTheme.bodySmall?.copyWith(
                            color: Colors.grey.shade600,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            );
          }).toList(),
        ),
      ],
    );
  }

  Widget _buildNameFields(ThemeData theme) {
    return Row(
      children: [
        Expanded(
          child: _buildTextField(
            label: 'First Name',
            hint: 'Enter your first name',
            icon: Iconsax.user,
            validator: (value) {
              if (value == null || value.isEmpty) {
                return 'Please enter your first name';
              }
              return null;
            },
            onChanged: (value) => setState(() => _firstName = value),
          ),
        ),
        const SizedBox(width: 16),
        Expanded(
          child: _buildTextField(
            label: 'Last Name',
            hint: 'Enter your last name',
            icon: Iconsax.user,
            validator: (value) {
              if (value == null || value.isEmpty) {
                return 'Please enter your last name';
              }
              return null;
            },
            onChanged: (value) => setState(() => _lastName = value),
          ),
        ),
      ],
    );
  }

  Widget _buildPhoneField(ThemeData theme) {
    return _buildTextField(
      label: 'Phone Number',
      hint: 'Enter your phone number',
      icon: Iconsax.call,
      keyboardType: TextInputType.phone,
      validator: (value) {
        if (value == null || value.isEmpty) {
          return 'Please enter your phone number';
        }
        return null;
      },
      onChanged: (value) => setState(() => _phone = value),
    );
  }

  Widget _buildUsernameField(ThemeData theme) {
    return _buildTextField(
      label: 'Username',
      hint: 'Choose a username',
      icon: Iconsax.user_tag,
      validator: (value) {
        if (value == null || value.isEmpty) {
          return 'Please enter a username';
        }
        if (value.length < 3) {
          return 'Username must be at least 3 characters';
        }
        if (!RegExp(r'^[a-zA-Z0-9_]+$').hasMatch(value)) {
          return 'Username can only contain letters, numbers, and underscores';
        }
        return null;
      },
      onChanged: (value) => setState(() => _username = value),
    );
  }

  Widget _buildRegionField(ThemeData theme) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Region',
          style: theme.textTheme.bodyMedium?.copyWith(
            fontWeight: FontWeight.w500,
            color: Colors.grey.shade700,
          ),
        ),
        const SizedBox(height: 8),
        DropdownButtonFormField<String>(
          decoration: InputDecoration(
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide(color: Colors.grey.shade300),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide(color: Colors.grey.shade300),
            ),
            contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
          ),
          hint: const Text('Select your region'),
          isExpanded: true,
          validator: (value) {
            if (value == null || value.isEmpty) {
              return 'Please select your region';
            }
            return null;
          },
          items: _regions.map((region) {
            return DropdownMenuItem(
              value: region,
              child: Text(region, overflow: TextOverflow.ellipsis),
            );
          }).toList(),
          onChanged: (value) => setState(() => _region = value ?? ''),
        ),
      ],
    );
  }

  Widget _buildFarmSizeField(ThemeData theme) {
    return Column(
      children: [
        _buildTextField(
          label: 'Farm Size (hectares)',
          hint: 'Enter your farm size',
          icon: Iconsax.tree,
          keyboardType: TextInputType.number,
          validator: (value) {
            if (value == null || value.isEmpty) {
              return 'Please enter your farm size';
            }
            return null;
          },
          onChanged: (value) => setState(() => _farmSize = value),
        ),
        const SizedBox(height: 16),
      ],
    );
  }

  Widget _buildBusinessLicenseField(ThemeData theme) {
    return Column(
      children: [
        _buildTextField(
          label: 'Business License Number',
          hint: 'Enter your business license number',
          icon: Iconsax.document,
          validator: (value) {
            if (value == null || value.isEmpty) {
              return 'Please enter your business license number';
            }
            return null;
          },
          onChanged: (value) => setState(() => _businessLicense = value),
        ),
        const SizedBox(height: 16),
      ],
    );
  }

  Widget _buildEmailField(ThemeData theme) {
    return _buildTextField(
      label: 'Email Address',
      hint: 'Enter your email address',
      icon: Iconsax.sms,
      keyboardType: TextInputType.emailAddress,
      validator: (value) {
        if (value == null || value.isEmpty) {
          return 'Please enter your email address';
        }
        if (!RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$').hasMatch(value)) {
          return 'Please enter a valid email address';
        }
        return null;
      },
      onChanged: (value) => setState(() => _email = value),
    );
  }

  Widget _buildPasswordFields(ThemeData theme) {
    return Column(
      children: [
        _buildTextField(
          label: 'Password',
          hint: 'Enter your password',
          icon: Iconsax.lock,
          obscureText: !_showPassword,
          suffixIcon: IconButton(
            icon: Icon(_showPassword ? Iconsax.eye : Iconsax.eye_slash),
            onPressed: () => setState(() => _showPassword = !_showPassword),
          ),
          validator: (value) {
            if (value == null || value.isEmpty) {
              return 'Please enter a password';
            }
            if (value.length < 8) {
              return 'Password must be at least 8 characters';
            }
            return null;
          },
          onChanged: (value) => setState(() => _password = value),
        ),
        const SizedBox(height: 16),
        _buildTextField(
          label: 'Confirm Password',
          hint: 'Confirm your password',
          icon: Iconsax.lock,
          obscureText: !_showConfirmPassword,
          suffixIcon: IconButton(
            icon: Icon(_showConfirmPassword ? Iconsax.eye : Iconsax.eye_slash),
            onPressed: () => setState(() => _showConfirmPassword = !_showConfirmPassword),
          ),
          validator: (value) {
            if (value == null || value.isEmpty) {
              return 'Please confirm your password';
            }
            if (value != _password) {
              return 'Passwords do not match';
            }
            return null;
          },
          onChanged: (value) => setState(() => _confirmPassword = value),
        ),
      ],
    );
  }

  Widget _buildTextField({
    required String label,
    required String hint,
    required IconData icon,
    TextInputType? keyboardType,
    bool obscureText = false,
    Widget? suffixIcon,
    String? Function(String?)? validator,
    void Function(String)? onChanged,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: Theme.of(context).textTheme.bodyMedium?.copyWith(
            fontWeight: FontWeight.w500,
            color: Colors.grey.shade700,
          ),
        ),
        const SizedBox(height: 8),
        TextFormField(
          keyboardType: keyboardType,
          obscureText: obscureText,
          decoration: InputDecoration(
            prefixIcon: Icon(icon),
            suffixIcon: suffixIcon,
            hintText: hint,
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide(color: Colors.grey.shade300),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide(color: Colors.grey.shade300),
            ),
          ),
          validator: validator,
          onChanged: onChanged,
        ),
      ],
    );
  }

  Widget _buildErrorSuccessMessages(ThemeData theme) {
    return Column(
      children: [
        if (_errorMessage != null)
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 8.0),
            child: Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: Colors.red.shade50,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: Colors.red.shade200),
                boxShadow: [
                  BoxShadow(
                    color: Colors.red.shade100.withOpacity(0.2),
                    blurRadius: 8,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: Row(
                children: [
                  Icon(Iconsax.warning_2, color: Colors.red.shade500, size: 22),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Text(
                      _errorMessage!,
                      style: theme.textTheme.bodySmall?.copyWith(
                        color: Colors.red.shade700,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        if (_successMessage != null)
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 8.0),
            child: Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: Colors.green.shade50,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: Colors.green.shade200),
                boxShadow: [
                  BoxShadow(
                    color: Colors.green.shade100.withOpacity(0.2),
                    blurRadius: 8,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: Row(
                children: [
                  Icon(Iconsax.tick_circle, color: Colors.green.shade500, size: 22),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Text(
                      _successMessage!,
                      style: theme.textTheme.bodySmall?.copyWith(
                        color: Colors.green.shade700,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        if (_errorMessage != null || _successMessage != null)
          const SizedBox(height: 18),
      ],
    );
  }

  Widget _buildSubmitButton(ThemeData theme) {
    return SizedBox(
      width: double.infinity,
      child: ElevatedButton(
        onPressed: _isLoading ? null : () {
          if (_formKey.currentState!.validate()) {
            _submitForm();
          }
        },
        style: ElevatedButton.styleFrom(
          padding: const EdgeInsets.symmetric(vertical: 16),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          backgroundColor: Colors.green.shade500,
          disabledBackgroundColor: Colors.green.shade500.withOpacity(0.5),
          elevation: 0,
          shadowColor: Colors.transparent,
        ),
        child: _isLoading
            ? const SizedBox(
                width: 20,
                height: 20,
                child: CircularProgressIndicator(
                  strokeWidth: 2,
                  valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                ),
              )
            : Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    'Create Account',
                    style: theme.textTheme.bodyMedium?.copyWith(
                      color: Colors.white,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  const SizedBox(width: 8),
                  const Icon(Iconsax.arrow_right_2, size: 20, color: Colors.white),
                ],
              ),
      ),
    );
  }

  Widget _buildLoginLink(ThemeData theme) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Text(
          'Already have an account? ',
          style: theme.textTheme.bodyMedium?.copyWith(
            color: Colors.grey.shade600,
          ),
        ),
        InkWell(
          onTap: widget.onSwitchToLogin,
          child: Text(
            'Sign in here',
            style: theme.textTheme.bodyMedium?.copyWith(
              color: Colors.green.shade600,
              fontWeight: FontWeight.w600,
              decoration: TextDecoration.underline,
            ),
          ),
        ),
      ],
    );
  }

  void _submitForm() async {
    if (!_formKey.currentState!.validate()) {
      return;
    }

    setState(() {
      _isLoading = true;
      _errorMessage = null;
      _successMessage = null;
    });

    try {
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      
      final success = await authProvider.register(
        email: _email,
        password: _password,
        passwordConfirm: _confirmPassword,
        username: _username,
        firstName: _firstName,
        lastName: _lastName,
        phone: _phone,
        region: _region,
        userType: _userType,
        location: _location,
        farmSize: _userType == 'farmer' ? _farmSize : null,
        businessLicenseNumber: _userType == 'buyer' ? _businessLicense : null,
      );
      
      if (success) {
        setState(() {
          _successMessage = 'Registration successful! Redirecting...';
        });

        await Future.delayed(const Duration(milliseconds: 1500));

        if (mounted) {
          Navigator.of(context).pushReplacementNamed('/marketplace');
        }
      } else {
        setState(() {
          _errorMessage = authProvider.errorMessage ?? 'Registration failed. Please try again.';
        });
      }
    } catch (e) {
      setState(() {
        _errorMessage = 'An unexpected error occurred. Please try again.';
      });
    } finally {
      if (_successMessage == null && mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }
}
