package com.ratnika.auth.repository;

import com.ratnika.auth.entity.VerificationToken;
import com.ratnika.auth.entity.VerificationToken.Purpose;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface VerificationTokenRepository extends JpaRepository<VerificationToken, UUID> {

    Optional<VerificationToken> findFirstByEmailIgnoreCaseAndPurposeOrderByCreatedAtDesc(
            String email, Purpose purpose);

    @Modifying
    @Query("DELETE FROM VerificationToken v WHERE v.email = :email AND v.purpose = :purpose")
    void deleteAllForEmailAndPurpose(@Param("email") String email, @Param("purpose") Purpose purpose);
}
