package com.lukas99.ysgmanager;

import static org.springframework.security.config.Customizer.withDefaults;

import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

/**
 * Configure application to be an OAuth 2.0 resource server which looks for an Authorization header
 * with an access token in it.
 */
@Configuration
public class SecurityConfiguration {

  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    /*
      In Okta, add 2 'groups' claims (Access Token & ID Token) and add the applications to
      the corresponding groups. See:
      https://developer.okta.com/blog/2019/06/20/spring-preauthorize
      Use @EnableGlobalMethodSecurity(prePostEnabled = true) in case @PreAuthorize
      should be used on REST controller methods. Or configure it in SecurityConfiguration e.g.
      .requestMatchers("/api/v1/secure").hasAuthority("ysg-admins")
     */
    return http
        // disable CSRF protection for now, otherwise POST requests do not work with https
        .csrf(AbstractHttpConfigurer::disable)
        .authorizeHttpRequests(customizer -> customizer
            .requestMatchers("/", "/index.html", "/**.js", "/**.css", "/favicon.ico",
                "/assets/images/**.jpg", "/assets/i18n/**.json").permitAll()
            // to support PWA
            .requestMatchers("manifest.webmanifest", "ngsw.json").permitAll()
            .anyRequest().authenticated()
        )
        // enable OAuth2/OIDC
        .oauth2Login(withDefaults())
        .oauth2ResourceServer(customizer -> customizer.jwt(withDefaults()))
        .build();
  }

  /**
   * In order for your Angular app (on port 4200) to communicate with your Spring Boot app (on port
   * 8080), we have to enable CORS (cross-origin resource sharing).
   *
   * @return The CORS filter registration bean.
   */
  @Bean
  public FilterRegistrationBean<CorsFilter> simpleCorsFilter() {
    var source = new UrlBasedCorsConfigurationSource();
    var config = new CorsConfiguration();
    config.setAllowCredentials(true);
    // also add origins to auth.interceptor.ts and to Okta trusted Origins (Security -> API)
    // at https://dev-280604-admin.okta.com/admin/access/api/trusted_origins
    // also see: https://developer.okta.com/docs/guides/enable-cors/main/
    config.addAllowedOrigin("http://localhost:4200");
    config.addAllowedOrigin("https://youngstargames.zapto.org");
    config.addAllowedOrigin("https://ysg-manager-server-24h6rzjfpa-ew.a.run.app");
    config.addAllowedMethod("*");
    config.addAllowedHeader("*");
    source.registerCorsConfiguration("/**", config);
    var bean = new FilterRegistrationBean<>(new CorsFilter(source));
    bean.setOrder(Ordered.HIGHEST_PRECEDENCE);
    return bean;
  }

}
