package cn.kikiw.likegirl;

import cn.kikiw.likegirl.service.JwtService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.Test;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Duration;

import static org.assertj.core.api.Assertions.assertThat;

class JwtServiceTests {

    private static final String SECRET = "test-secret-key-that-is-long-enough-for-hs256-tests";

    private final JwtService jwtService = new JwtService(SECRET);

    @Test
    void generatedTokenExpiresAboutOneHourAfterIssuedAt() {
        String token = jwtService.generateToken(1L, "demo");

        SecretKey secretKey = Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8));
        Claims claims = Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();

        long ttlSeconds = Duration.between(
                claims.getIssuedAt().toInstant(),
                claims.getExpiration().toInstant()
        ).toSeconds();

        assertThat(ttlSeconds).isBetween(3595L, 3605L);
    }
}
