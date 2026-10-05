package com.canteen.service;

import com.canteen.dto.AuthResponse;
import com.canteen.dto.LoginRequest;
import com.canteen.dto.RegisterRequest;
import com.canteen.dto.UserDto;
import com.canteen.entity.Role;
import com.canteen.entity.User;
import com.canteen.exception.BadRequestException;
import com.canteen.exception.ResourceNotFoundException;
import com.canteen.repository.UserRepository;
import com.canteen.security.JwtUtils;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtUtils jwtUtils) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (request.getPassword() == null || !request.getPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("Password and Confirm Password do not match");
        }

        String email = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new BadRequestException("User with email '" + email + "' already exists");
        }

        User user = new User();
        user.setName(request.getName().trim());
        user.setEmail(email);
        user.setPhone(request.getPhone().trim());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.STUDENT);

        User savedUser = userRepository.save(user);

        // Authenticate & generate token
        UserDetails userDetails = new org.springframework.security.core.userdetails.User(
                savedUser.getEmail(),
                savedUser.getPassword(),
                java.util.Collections.singletonList(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_" + savedUser.getRole().name()))
        );

        String token = jwtUtils.generateToken(userDetails, savedUser.getRole().name(), savedUser.getId(), savedUser.getName());
        return new AuthResponse(token, mapToDto(savedUser));
    }

    public AuthResponse login(LoginRequest request) {
        String email = request.getEmail().trim().toLowerCase();

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, request.getPassword())
        );

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        String token = jwtUtils.generateToken(userDetails, user.getRole().name(), user.getId(), user.getName());
        return new AuthResponse(token, mapToDto(user));
    }

    public UserDto getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        return mapToDto(user);
    }

    public UserDto mapToDto(User user) {
        return new UserDto(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole(),
                user.getCreatedAt()
        );
    }
}
