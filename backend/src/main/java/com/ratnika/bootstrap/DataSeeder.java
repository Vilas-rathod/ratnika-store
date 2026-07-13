package com.ratnika.bootstrap;

import com.ratnika.catalog.banner.entity.Banner;
import com.ratnika.catalog.banner.repository.BannerRepository;
import com.ratnika.catalog.category.entity.Category;
import com.ratnika.catalog.category.repository.CategoryRepository;
import com.ratnika.catalog.product.entity.Material;
import com.ratnika.catalog.product.entity.Occasion;
import com.ratnika.catalog.product.entity.Product;
import com.ratnika.catalog.product.entity.ProductAttributes;
import com.ratnika.catalog.product.entity.ProductImage;
import com.ratnika.catalog.product.entity.ProductVariant;
import com.ratnika.catalog.product.repository.ProductRepository;
import com.ratnika.catalog.review.entity.Review;
import com.ratnika.catalog.review.repository.ReviewRepository;
import com.ratnika.common.util.SlugUtils;
import com.ratnika.coupon.entity.Coupon;
import com.ratnika.coupon.repository.CouponRepository;
import com.ratnika.user.entity.Role;
import com.ratnika.user.entity.User;
import com.ratnika.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

/**
 * Seeds demo data (users, catalogue, coupons, banners, reviews) on first run
 * when {@code app.seed.enabled=true} and the database is empty. Mirrors the
 * frontend's demo dataset so both stacks tell the same story.
 */
@Slf4j
@Component
@RequiredArgsConstructor
@ConditionalOnProperty(name = "app.seed.enabled", havingValue = "true")
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final ReviewRepository reviewRepository;
    private final CouponRepository couponRepository;
    private final BannerRepository bannerRepository;
    private final PasswordEncoder passwordEncoder;

    private static final String[][] CATEGORY_DEFS = {
            {"Rings", "ring", "Statement & everyday rings crafted to shine."},
            {"Earrings", "earring", "Studs, jhumkas & danglers for every occasion."},
            {"Necklaces", "necklace", "Timeless necklaces to elevate any look."},
            {"Chains", "chain", "Delicate to bold chains in premium finishes."},
            {"Pendants", "pendant", "Meaningful pendants with intricate detail."},
            {"Bangles", "bangle", "Traditional & contemporary bangles."},
            {"Bracelets", "bracelet", "Chic bracelets that make a statement."},
            {"Anklets", "anklet", "Playful anklets with a graceful jingle."},
            {"Mangalsutra", "mangalsutra", "Sacred designs, modern craftsmanship."},
            {"Nose Pins", "nosepin", "Subtle sparkle for a classic touch."},
            {"Jewellery Sets", "set", "Perfectly matched sets for grand occasions."},
    };

    private static final Material[] MATERIALS = Material.values();
    private static final Occasion[] OCCASIONS = Occasion.values();
    private static final String[] STONES = {"American Diamond", "Kundan", "Cubic Zirconia", "Pearl", "Ruby", "Emerald", null};
    private static final String[] COLORS = {"Gold", "Rose Gold", "Silver", "Oxidised", "Multicolour"};
    private static final String[] ADJECTIVES = {"Elegant", "Royal", "Timeless", "Ethereal", "Regal", "Divine", "Blossom", "Celestial", "Heritage", "Aurora", "Radiant", "Grace"};
    private static final String[] NOUNS = {"Charm", "Bloom", "Whisper", "Aura", "Muse", "Grace", "Sparkle", "Petal", "Crown", "Glow", "Mystique", "Legacy"};
    private static final String[][] SUPPLIERS = {
            {"Jaipur Gems Wholesale", "https://supplier.example/jaipur-gems"},
            {"Mumbai Jewel Hub", "https://supplier.example/mumbai-jewel"},
            {"Rajkot Silver Co.", "https://supplier.example/rajkot-silver"},
            {"Delhi Fashion Imports", "https://supplier.example/delhi-fashion"},
    };

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Database already populated — skipping seed.");
            return;
        }
        log.info("Seeding demo data…");
        seedUsers();
        List<Category> categories = seedCategories();
        List<Product> products = seedProducts(categories);
        seedReviews(products);
        seedCoupons();
        seedBanners();
        log.info("Seed complete: {} categories, {} products.", categories.size(), products.size());
    }

    private void seedUsers() {
        userRepository.save(User.builder()
                .firstName("Ratnika").lastName("Admin").email("admin@ratnika.in")
                .phone("+91 90000 00001").password(passwordEncoder.encode("Admin@123"))
                .role(Role.ADMIN).emailVerified(true).build());
        userRepository.save(User.builder()
                .firstName("Aarav").lastName("Sharma").email("customer@ratnika.in")
                .phone("+91 90000 00002").password(passwordEncoder.encode("Customer@123"))
                .role(Role.CUSTOMER).emailVerified(true).build());
        userRepository.save(User.builder()
                .firstName("Priya").lastName("Nair").email("priya@example.com")
                .phone("+91 90000 00003").password(passwordEncoder.encode("Customer@123"))
                .role(Role.CUSTOMER).emailVerified(true).build());
    }

    private List<Category> seedCategories() {
        List<Category> saved = new ArrayList<>();
        for (int i = 0; i < CATEGORY_DEFS.length; i++) {
            String[] def = CATEGORY_DEFS[i];
            saved.add(categoryRepository.save(Category.builder()
                    .name(def[0]).slug(SlugUtils.slugify(def[0])).description(def[2])
                    .imageUrl(PlaceholderImages.jewellery(def[1], i, def[0]))
                    .active(true).sortOrder(i + 1).build()));
        }
        return saved;
    }

    private List<Product> seedProducts(List<Category> categories) {
        List<Product> all = new ArrayList<>();
        int n = 0;
        for (int ci = 0; ci < categories.size(); ci++) {
            Category category = categories.get(ci);
            String motif = CATEGORY_DEFS[ci][1];
            for (int p = 0; p < 6; p++) {
                n++;
                int seed = n;
                String name = ADJECTIVES[(seed * 3) % ADJECTIVES.length] + " "
                        + NOUNS[(seed * 5) % NOUNS.length] + " "
                        + category.getName().replaceAll("s$", "");
                long base = 299 + ((seed * 137L) % 40) * 75;
                BigDecimal price = BigDecimal.valueOf(base);
                BigDecimal mrp = BigDecimal.valueOf(Math.round(base * (1.25 + (seed % 5) * 0.08) / 10.0) * 10);
                BigDecimal cost = BigDecimal.valueOf(Math.round(base * 0.45));
                Material material = MATERIALS[seed % MATERIALS.length];
                Occasion occasion = OCCASIONS[seed % OCCASIONS.length];
                String stone = STONES[seed % STONES.length];
                int stock = (seed * 17) % 6 == 0 ? seed % 4 : 12 + (seed * 11) % 90;
                String[] supplier = SUPPLIERS[seed % SUPPLIERS.length];

                Product product = Product.builder()
                        .name(name).slug(SlugUtils.slugify(name) + "-" + seed)
                        .description("Discover the " + name.toLowerCase() + " — a "
                                + material.name().toLowerCase().replace('_', ' ')
                                + " piece finished with "
                                + (stone == null ? "a polished sheen" : stone.toLowerCase() + " accents")
                                + ". Thoughtfully crafted for " + occasion.name().toLowerCase().replace('_', ' ')
                                + " and designed to last. Comes in a premium Ratnika gift box.")
                        .category(category)
                        .price(price).mrp(mrp)
                        .sku("VC-" + category.getSlug().substring(0, Math.min(3, category.getSlug().length())).toUpperCase() + "-" + seed)
                        .stock(stock)
                        .attributes(ProductAttributes.builder()
                                .material(material).stoneType(stone)
                                .weightGrams(2 + (seed % 18)).color(COLORS[seed % COLORS.length])
                                .occasion(occasion).build())
                        .rating(0).reviewCount(0)
                        .featured(seed % 6 == 0).trending(seed % 5 == 0)
                        .bestSeller(seed % 7 == 0).newArrival(seed % 4 == 0)
                        .active(true)
                        .supplierName(supplier[0]).supplierUrl(supplier[1]).costPrice(cost)
                        .build();

                for (int k = 0; k < 3; k++) {
                    product.addImage(ProductImage.builder()
                            .url(PlaceholderImages.jewellery(motif, seed + k, k == 0 ? category.getName() : ""))
                            .altText(name + " view " + (k + 1)).sortOrder(k).build());
                }
                if (ci == 0 || ci == 5) { // rings & bangles get size variants
                    String[] sizes = {"14", "16", "18", "20"};
                    for (int vi = 0; vi < sizes.length; vi++) {
                        product.addVariant(ProductVariant.builder()
                                .name("Size").value(sizes[vi])
                                .priceDelta(BigDecimal.valueOf(vi * 40L))
                                .stock(5 + (seed + vi) % 20).sku("VC-" + seed + "-S" + sizes[vi]).build());
                    }
                }
                all.add(productRepository.save(product));
            }
        }
        return all;
    }

    private void seedReviews(List<Product> products) {
        User customer = userRepository.findByEmailIgnoreCase("customer@ratnika.in").orElseThrow();
        String[] titles = {"Absolutely stunning!", "Great value", "Loved it", "Perfect gift", "Good quality"};
        String[] comments = {
                "The finish is gorgeous and it looks even better in person. Got so many compliments!",
                "Lightweight and comfortable to wear all day. Packaging was premium too.",
                "Exactly as pictured. Delivery was quick and the gift box was lovely.",
                "Beautiful craftsmanship for the price. Would definitely buy again.",
        };
        for (int i = 0; i < 20; i++) {
            Product product = products.get(i);
            Review review = Review.builder()
                    .product(product).user(customer).userName(customer.fullName())
                    .productName(product.getName())
                    .rating(4 + (i % 2)).title(titles[i % titles.length])
                    .comment(comments[i % comments.length])
                    .approved(i % 5 != 0).build();
            reviewRepository.save(review);
            List<Review> approved = reviewRepository.findByProductAndApprovedTrue(product);
            if (!approved.isEmpty()) {
                product.setReviewCount(approved.size());
                product.setRating(Math.round(approved.stream().mapToInt(Review::getRating).average().orElse(0) * 10.0) / 10.0);
                productRepository.save(product);
            }
        }
    }

    private void seedCoupons() {
        couponRepository.save(Coupon.builder()
                .code("WELCOME15").description("15% off your first order (max ₹300)")
                .type(Coupon.Type.PERCENT).value(BigDecimal.valueOf(15))
                .minOrderAmount(BigDecimal.valueOf(799)).maxDiscount(BigDecimal.valueOf(300))
                .expiresAt(Instant.now().plus(365, ChronoUnit.DAYS)).usageLimit(1000).usedCount(214)
                .active(true).build());
        couponRepository.save(Coupon.builder()
                .code("FESTIVE500").description("Flat ₹500 off on orders above ₹2499")
                .type(Coupon.Type.FLAT).value(BigDecimal.valueOf(500))
                .minOrderAmount(BigDecimal.valueOf(2499))
                .expiresAt(Instant.now().plus(200, ChronoUnit.DAYS)).usageLimit(500).usedCount(88)
                .active(true).build());
        couponRepository.save(Coupon.builder()
                .code("SILVER10").description("10% off sitewide (max ₹250)")
                .type(Coupon.Type.PERCENT).value(BigDecimal.valueOf(10))
                .minOrderAmount(BigDecimal.valueOf(499)).maxDiscount(BigDecimal.valueOf(250))
                .expiresAt(Instant.now().plus(120, ChronoUnit.DAYS)).usageLimit(2000).usedCount(640)
                .active(true).build());
    }

    private void seedBanners() {
        bannerRepository.save(Banner.builder()
                .title("The Festive Edit").subtitle("Handcrafted jewellery to light up every celebration. Up to 40% off.")
                .imageUrl(PlaceholderImages.banner(0, 1400, 520)).ctaLabel("Shop Festive")
                .ctaLink("/shop?occasion=FESTIVE").placement(Banner.Placement.HERO).active(true).sortOrder(1).build());
        bannerRepository.save(Banner.builder()
                .title("Bridal Splendour").subtitle("Complete sets & mangalsutra for your special day.")
                .imageUrl(PlaceholderImages.banner(3, 1400, 520)).ctaLabel("Explore Bridal")
                .ctaLink("/shop?category=jewellery-sets").placement(Banner.Placement.HERO).active(true).sortOrder(2).build());
        bannerRepository.save(Banner.builder()
                .title("Everyday Silver").subtitle("925 sterling-look pieces for daily grace.")
                .imageUrl(PlaceholderImages.banner(2, 1400, 520)).ctaLabel("Shop Silver")
                .ctaLink("/shop?material=SILVER").placement(Banner.Placement.HERO).active(true).sortOrder(3).build());
        bannerRepository.save(Banner.builder()
                .title("First Order? Get 15% Off").subtitle("Use code WELCOME15 at checkout.")
                .imageUrl(PlaceholderImages.banner(4, 1200, 300)).ctaLabel("Grab the Deal")
                .ctaLink("/shop").placement(Banner.Placement.PROMO).active(true).sortOrder(1).build());
    }
}
