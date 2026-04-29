package cn.kikiw.likegirl.service.impl;

import cn.kikiw.likegirl.service.AvatarStorageService;
import io.minio.BucketExistsArgs;
import io.minio.MakeBucketArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

@Service
public class MinioAvatarStorageService implements AvatarStorageService {

    @Value("${minio.endpoint:}")
    private String endpoint;
    @Value("${minio.access-key:}")
    private String accessKey;
    @Value("${minio.secret-key:}")
    private String secretKey;
    @Value("${minio.bucket:}")
    private String bucket;
    @Value("${minio.public-base-url:}")
    private String publicBaseUrl;

    @PostConstruct
    public void init() {
        endpoint = clean(endpoint);
        accessKey = clean(accessKey);
        secretKey = clean(secretKey);
        bucket = clean(bucket);
        publicBaseUrl = clean(publicBaseUrl);
    }

    @Override
    public String upload(MultipartFile file, Long userId) {
        ensureConfigured();
        String objectName = "avatars/" + userId + "/" + UUID.randomUUID() + "." + extension(file);
        try {
            MinioClient client = MinioClient.builder()
                    .endpoint(endpoint)
                    .credentials(accessKey, secretKey)
                    .build();
            ensureBucket(client);
            client.putObject(PutObjectArgs.builder()
                    .bucket(bucket)
                    .object(objectName)
                    .contentType(file.getContentType())
                    .stream(file.getInputStream(), file.getSize(), -1L)
                    .build());
            return publicBaseUrl.replaceAll("/+$", "") + "/" + objectName;
        } catch (ResponseStatusException ex) {
            throw ex;
        } catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "avatar upload failed");
        }
    }

    private void ensureBucket(MinioClient client) {
        try {
            if (client.bucketExists(BucketExistsArgs.builder().bucket(bucket).build())) {
                return;
            }
            client.makeBucket(MakeBucketArgs.builder().bucket(bucket).build());
        } catch (Exception ignored) {
            // Some deployments allow writing to an existing bucket but not bucket administration.
        }
    }

    private void ensureConfigured() {
        if (endpoint.isBlank() || accessKey.isBlank() || secretKey.isBlank() || bucket.isBlank() || publicBaseUrl.isBlank()) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "MinIO is not configured");
        }
    }

    private String extension(MultipartFile file) {
        String filename = file.getOriginalFilename() == null ? "" : file.getOriginalFilename().toLowerCase();
        int dot = filename.lastIndexOf('.');
        return dot >= 0 ? filename.substring(dot + 1) : "jpg";
    }

    private String clean(String value) {
        return value == null ? "" : value.trim();
    }
}
