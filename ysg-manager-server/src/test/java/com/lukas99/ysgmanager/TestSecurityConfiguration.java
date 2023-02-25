package com.lukas99.ysgmanager;

import java.util.HashMap;
import java.util.Map;
import org.mockito.Mockito;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.security.oauth2.client.InMemoryOAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.registration.InMemoryClientRegistrationRepository;
import org.springframework.security.oauth2.client.web.AuthenticatedPrincipalOAuth2AuthorizedClientRepository;
import org.springframework.security.oauth2.client.web.OAuth2AuthorizedClientRepository;
import org.springframework.security.oauth2.core.AuthorizationGrantType;
import org.springframework.security.oauth2.core.ClientAuthenticationMethod;
import org.springframework.security.oauth2.jwt.JwtDecoder;

/**
 * Configuration for integration tests which overrides the default Spring Security settings and
 * mocks the beans so OIDC discovery doesn’t happen.
 * <p>
 * See https://developer.okta.com/blog/2019/04/15/testing-spring-security-oauth-with-junit#how-to-handle-oidc-discovery-in-spring-boot-integration-tests
 */
@TestConfiguration
public class TestSecurityConfiguration {

  private final ClientRegistration clientRegistration;

  public TestSecurityConfiguration() {
    this.clientRegistration = clientRegistration().build();
  }

  @Bean
  ClientRegistrationRepository clientRegistrationRepository() {
    return new InMemoryClientRegistrationRepository(clientRegistration);
  }

  private ClientRegistration.Builder clientRegistration() {
    Map<String, Object> metadata = new HashMap<>();
    metadata.put("end_session_endpoint", "https://jhipster.org/logout");

    return ClientRegistration.withRegistrationId("oidc")
        .redirectUri("{baseUrl}/{action}/oauth2/code/{registrationId}")
        .clientAuthenticationMethod(ClientAuthenticationMethod.CLIENT_SECRET_BASIC)
        .authorizationGrantType(AuthorizationGrantType.AUTHORIZATION_CODE)
        .scope("read:user")
        .authorizationUri("https://jhipster.org/login/oauth/authorize")
        .tokenUri("https://jhipster.org/login/oauth/access_token")
        .jwkSetUri("https://jhipster.org/oauth/jwk")
        .userInfoUri("https://api.jhipster.org/user")
        .providerConfigurationMetadata(metadata)
        .userNameAttributeName("id")
        .clientName("Client Name")
        .clientId("client-id")
        .clientSecret("client-secret");
  }

  @Bean
  JwtDecoder jwtDecoder() {
    return Mockito.mock(JwtDecoder.class);
  }

  @Bean
  public OAuth2AuthorizedClientService authorizedClientService(
      ClientRegistrationRepository clientRegistrationRepository) {
    return new InMemoryOAuth2AuthorizedClientService(clientRegistrationRepository);
  }

  @Bean
  public OAuth2AuthorizedClientRepository authorizedClientRepository(
      OAuth2AuthorizedClientService authorizedClientService) {
    return new AuthenticatedPrincipalOAuth2AuthorizedClientRepository(authorizedClientService);
  }

}
