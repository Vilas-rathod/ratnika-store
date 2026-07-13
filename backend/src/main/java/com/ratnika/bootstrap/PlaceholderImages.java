package com.ratnika.bootstrap;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;

/**
 * Generates elegant SVG placeholder images as data URIs for seed data, so the
 * demo works fully offline. In production these are replaced by Cloudinary/S3
 * URLs uploaded through the admin panel.
 */
final class PlaceholderImages {

    private PlaceholderImages() {
    }

    private static final String[][] PALETTES = {
            {"#f6ead8", "#eed9b8", "#a5761f"},
            {"#f2e8e8", "#e6d0d0", "#8f5656"},
            {"#e9edf2", "#d3dbe6", "#5a6b84"},
            {"#ece9f2", "#d9d2e8", "#6d5a8a"},
            {"#e9f0ec", "#d2e2d8", "#4e7361"},
            {"#f4ece2", "#e8d8c2", "#96662a"},
    };

    private static final Map<String, String> MOTIFS = Map.ofEntries(
            Map.entry("ring", "<circle cx='200' cy='215' r='70' fill='none' stroke='{fg}' stroke-width='14'/><path d='M200 118 l26 30 -26 34 -26 -34 z' fill='{fg}'/>"),
            Map.entry("earring", "<circle cx='200' cy='150' r='26' fill='none' stroke='{fg}' stroke-width='10'/><path d='M200 176 v34' stroke='{fg}' stroke-width='8'/><path d='M200 210 l34 44 -34 56 -34 -56 z' fill='{fg}'/>"),
            Map.entry("necklace", "<path d='M110 130 q90 130 180 0' fill='none' stroke='{fg}' stroke-width='10' stroke-linecap='round'/><path d='M200 196 l30 38 -30 50 -30 -50 z' fill='{fg}'/>"),
            Map.entry("chain", "<path d='M120 140 q80 110 160 0' fill='none' stroke='{fg}' stroke-width='9' stroke-dasharray='18 10' stroke-linecap='round'/>"),
            Map.entry("pendant", "<path d='M200 130 v40' stroke='{fg}' stroke-width='8'/><ellipse cx='200' cy='230' rx='46' ry='58' fill='{fg}'/>"),
            Map.entry("bangle", "<circle cx='200' cy='200' r='88' fill='none' stroke='{fg}' stroke-width='16'/><circle cx='200' cy='200' r='62' fill='none' stroke='{fg}' stroke-width='5'/>"),
            Map.entry("bracelet", "<path d='M120 200 a80 80 0 0 1 160 0' fill='none' stroke='{fg}' stroke-width='14' stroke-linecap='round'/><circle cx='200' cy='132' r='16' fill='{fg}'/>"),
            Map.entry("anklet", "<path d='M120 210 q80 60 160 0' fill='none' stroke='{fg}' stroke-width='9' stroke-linecap='round'/><circle cx='200' cy='240' r='7' fill='{fg}'/>"),
            Map.entry("mangalsutra", "<path d='M120 130 q80 100 160 0' fill='none' stroke='{fg}' stroke-width='8' stroke-dasharray='4 8'/><circle cx='200' cy='215' r='24' fill='{fg}'/>"),
            Map.entry("nosepin", "<circle cx='200' cy='200' r='20' fill='{fg}'/><path d='M200 160 v-24' stroke='{fg}' stroke-width='6' stroke-linecap='round'/>"),
            Map.entry("set", "<path d='M130 128 q70 76 140 0' fill='none' stroke='{fg}' stroke-width='8'/><path d='M200 176 l22 28 -22 36 -22 -36 z' fill='{fg}'/><circle cx='140' cy='268' r='22' fill='none' stroke='{fg}' stroke-width='8'/><circle cx='260' cy='268' r='22' fill='none' stroke='{fg}' stroke-width='8'/>")
    );

    static String jewellery(String motif, int seed, String label) {
        String[] p = PALETTES[Math.floorMod(seed, PALETTES.length)];
        String shape = MOTIFS.getOrDefault(motif, MOTIFS.get("ring")).replace("{fg}", p[2]);
        String text = label == null || label.isBlank() ? ""
                : "<text x='200' y='368' text-anchor='middle' font-family='Georgia,serif' font-size='19' fill='" + p[2] + "'>" + label + "</text>";
        String svg = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'>"
                + "<defs><linearGradient id='bg' x1='0' y1='0' x2='1' y2='1'>"
                + "<stop offset='0' stop-color='" + p[0] + "'/><stop offset='1' stop-color='" + p[1] + "'/></linearGradient></defs>"
                + "<rect width='400' height='400' fill='url(#bg)'/>"
                + "<circle cx='200' cy='200' r='140' fill='#ffffff' opacity='0.45'/>"
                + shape + text + "</svg>";
        return "data:image/svg+xml," + URLEncoder.encode(svg, StandardCharsets.UTF_8).replace("+", "%20");
    }

    static String banner(int seed, int w, int h) {
        String[] p = PALETTES[Math.floorMod(seed, PALETTES.length)];
        String svg = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 " + w + " " + h + "'>"
                + "<defs><linearGradient id='bg' x1='0' y1='0' x2='1' y2='0.6'>"
                + "<stop offset='0' stop-color='" + p[0] + "'/><stop offset='1' stop-color='" + p[1] + "'/></linearGradient></defs>"
                + "<rect width='" + w + "' height='" + h + "' fill='url(#bg)'/>"
                + "<g opacity='0.35' fill='none' stroke='" + p[2] + "' stroke-width='3'>"
                + "<circle cx='" + (w - 190) + "' cy='" + (h / 2) + "' r='150'/>"
                + "<circle cx='" + (w - 190) + "' cy='" + (h / 2) + "' r='105'/></g></svg>";
        return "data:image/svg+xml," + URLEncoder.encode(svg, StandardCharsets.UTF_8).replace("+", "%20");
    }
}
