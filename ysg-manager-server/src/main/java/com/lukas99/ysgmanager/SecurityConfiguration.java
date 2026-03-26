package com.lukas99.ysgmanager;

import static org.springframework.security.config.Customizer.withDefaults;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

/**
 * Configure application to be an OAuth 2.0 resource server which looks for an Authorization header
 * with an access token in it.
 */
@Configuration
public class SecurityConfiguration {

  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) {
    return http
        // disable CSRF protection for now, otherwise POST requests do not work with https
        .csrf(AbstractHttpConfigurer::disable)
        .cors(cors -> cors.configurationSource(corsConfigurationSource()))
        .authorizeHttpRequests(customizer -> customizer
            .requestMatchers("/", "/index.html", "/**.js", "/**.css", "/favicon.ico",
                "/assets/images/**.jpg", "/assets/icons/**.png", "/assets/i18n/**.json").permitAll()
            // to support PWA
            .requestMatchers("/manifest.webmanifest", "/ngsw.json").permitAll() // "/ngsw-worker.js"
            .anyRequest().authenticated()
        )
        .oauth2ResourceServer(oauth2 -> oauth2.jwt(withDefaults()))
        .build();
  }

  /**
   * In order for your Angular app (on port 4200) to communicate with your Spring Boot app (on port
   * 8080), we have to enable CORS (cross-origin resource sharing).
   *
   * @return The CORS configuration source bean.
   */
  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
    var config = new CorsConfiguration();
    config.setAllowCredentials(true);
    // also add origins to Keycloak Client configuration
    config.addAllowedOrigin("http://localhost:4200");
    config.addAllowedOrigin("https://ysg-manager-server-895187186258.europe-west1.run.app");
    config.addAllowedOrigin("https://ysg-manager--k8vb2jl.jollydesert-aef2d738.northeurope.azurecontainerapps.io");
    config.addAllowedMethod("*");
    config.addAllowedHeader("*");

    var source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", config);
    return source;
  }

}
