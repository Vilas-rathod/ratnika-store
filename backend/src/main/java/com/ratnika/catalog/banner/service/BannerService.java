package com.ratnika.catalog.banner.service;

import com.ratnika.catalog.banner.dto.BannerDtos.BannerRequest;
import com.ratnika.catalog.banner.dto.BannerDtos.BannerResponse;
import com.ratnika.catalog.banner.entity.Banner;
import com.ratnika.catalog.banner.repository.BannerRepository;
import com.ratnika.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BannerService {

    private final BannerRepository bannerRepository;

    @Transactional(readOnly = true)
    @Cacheable(value = "banners", key = "'active'")
    public List<BannerResponse> listActive() {
        return bannerRepository.findByActiveTrueOrderBySortOrderAsc().stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<BannerResponse> listAll() {
        return bannerRepository.findAllByOrderBySortOrderAsc().stream().map(this::toResponse).toList();
    }

    @Transactional
    @CacheEvict(value = "banners", allEntries = true)
    public BannerResponse create(BannerRequest request) {
        Banner banner = Banner.builder()
                .title(request.title())
                .subtitle(request.subtitle())
                .imageUrl(request.imageUrl())
                .ctaLabel(request.ctaLabel())
                .ctaLink(request.ctaLink())
                .placement(request.placement())
                .active(request.active() == null || request.active())
                .sortOrder((int) bannerRepository.count() + 1)
                .build();
        return toResponse(bannerRepository.save(banner));
    }

    @Transactional
    @CacheEvict(value = "banners", allEntries = true)
    public BannerResponse update(UUID id, BannerRequest request) {
        Banner banner = bannerRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("Banner", id));
        banner.setTitle(request.title());
        banner.setSubtitle(request.subtitle());
        banner.setImageUrl(request.imageUrl());
        banner.setCtaLabel(request.ctaLabel());
        banner.setCtaLink(request.ctaLink());
        banner.setPlacement(request.placement());
        if (request.active() != null) banner.setActive(request.active());
        return toResponse(bannerRepository.save(banner));
    }

    @Transactional
    @CacheEvict(value = "banners", allEntries = true)
    public void delete(UUID id) {
        bannerRepository.deleteById(id);
    }

    private BannerResponse toResponse(Banner b) {
        return new BannerResponse(b.getId(), b.getTitle(), b.getSubtitle(), b.getImageUrl(),
                b.getCtaLabel(), b.getCtaLink(), b.getPlacement(), b.isActive(), b.getSortOrder());
    }
}
