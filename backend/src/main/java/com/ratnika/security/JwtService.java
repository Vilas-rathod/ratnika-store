package com.ratnika.security;

import com.ratnika.config.props.AppProperties;
import com.ratnika.user.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Base64;
import java.util.Date;
import java.util.UUID;

/**
 * Issues and validates stateless JWT access tokens.
 * (Refresh tokens are opaque and persisted — see RefreshToken.)
 */
@Service
@RequiredArgsConstructor
public class JwtService {

    private final AppProperties props;

    private SecretKey key() {
        byte[] keyBytes = Base64.getDecoder().decode(props.getJwt().getSecret());
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateAccessToken(User user) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + props.getJwt().getAccessTokenExpiration());
        return Jwts.builder()
                .subject(user.getId().toString())
                .issuer(props.getJwt().getIssuer())
                .claim("role", user.getRole().name())
                .claim("email", user.getEmail())
                .issuedAt(now)
                .expiration(expiry)
                .signWith(key())
                .compact();
    }

    public UUID extractUserId(String token) {
        return UUID.fromString(parse(token).getSubject());
    }

    public boolean isValid(String token) {
        try {
            parse(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    private Claims parse(String token) {
        return Jwts.parser()
                .verifyWith(key())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
