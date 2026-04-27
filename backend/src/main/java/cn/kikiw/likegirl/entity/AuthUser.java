package cn.kikiw.likegirl.entity;

import java.time.LocalDateTime;

public class AuthUser {

    private Long id;
    private String username;
    private String displayName;
    private String passwordHash;
    private String avatarUrl;
    private String bio;
    private String mood;
    private LocalDateTime updatedAt;

    public AuthUser() {
    }

    public AuthUser(Long id, String username, String displayName, String passwordHash) {
        this(id, username, displayName, passwordHash, null, null, null, null);
    }

    public AuthUser(Long id, String username, String displayName, String passwordHash,
                    String avatarUrl, String bio, String mood, LocalDateTime updatedAt) {
        this.id = id;
        this.username = username;
        this.displayName = displayName;
        this.passwordHash = passwordHash;
        this.avatarUrl = avatarUrl;
        this.bio = bio;
        this.mood = mood;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getMood() {
        return mood;
    }

    public void setMood(String mood) {
        this.mood = mood;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
