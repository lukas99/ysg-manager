package com.lukas99.ysgmanager;

import com.google.cloud.spring.autoconfigure.core.GcpContextAutoConfiguration;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.Profile;

/**
 * Enable GCP autoconfiguration when application runs with profile 'gcloud' respectively when
 * application runs in GCP.
 * <br>
 * When GCP autoconfiguration is enabled but the application does not run in GCP context, the error
 * 'Your default credentials were not found' will be logged (but the application would start up
 * nevertheless).
 */
@Configuration
@Profile("gcloud")
@Import(GcpContextAutoConfiguration.class)
public class GcloudConfiguration {

}
