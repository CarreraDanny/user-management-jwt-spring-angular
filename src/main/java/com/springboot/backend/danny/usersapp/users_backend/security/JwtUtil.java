package com.springboot.backend.danny.usersapp.users_backend.security;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;

@Component
public class JwtUtil {

    // DEMO: clave HS256. En producción, muévelo a configuración segura
    private static final String SECRET_BASE64 = "YXZlcnktc2VjcmV0LWxvbmctc3RyaW5nLWZvci1kZW1vLXB1cnBvc2VzLTEyMzQ1Njc4OTA=";
    private static final long EXPIRATION_MS = 1000L * 60 * 60; // 1 hora

    private SecretKey getKey() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(SECRET_BASE64));
    }

    public String extractUsername(String token) {
        return getAllClaims(token).getSubject();
    }

    public List<String> extractAuthorities(String token) {
        Claims claims = getAllClaims(token);
        Object auth = claims.get("roles");
        if (auth instanceof List<?>) {
            return ((List<?>) auth).stream().map(Object::toString).collect(Collectors.toList());
        }
        return List.of();
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return getAllClaims(token).getExpiration().before(new Date());
    }

    private Claims getAllClaims(String token) {
        return Jwts.parserBuilder().setSigningKey(getKey()).build().parseClaimsJws(token).getBody();
    }

    // Opcional: generación de token (si luego expones un endpoint de login)
    public String generateToken(UserDetails userDetails) {
        List<String> roles = userDetails.getAuthorities().stream().map(GrantedAuthority::getAuthority).collect(Collectors.toList());
        return Jwts.builder()
                .setSubject(userDetails.getUsername())
                .claim("roles", roles)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_MS))
                .signWith(getKey(), SignatureAlgorithm.HS256)
                .compact();
    }
}

