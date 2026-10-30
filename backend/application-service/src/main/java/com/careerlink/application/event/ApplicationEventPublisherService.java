package com.careerlink.application.event;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;

import lombok.Builder;

import java.time.LocalDateTime;
import java.util.UUID;

@Component
public class ApplicationEventPublisherService {

    private static final Logger logger = LoggerFactory.getLogger(ApplicationEventPublisherService.class);

    @Autowired(required = false)
    private ApplicationEventPublisher springEventPublisher;

    public void publishEvent(String eventType, Long applicationId, Long candidateId, 
                             String candidateEmail, Long jobId, String jobTitle,
                             String prevStatus, String newStatus, String feedback) {
    	ApplicationNotificationEvent event = ApplicationNotificationEvent.builder()
    	        .eventId(UUID.randomUUID().toString())
    	        .eventType(eventType)
    	        .applicationId(applicationId)
    	        .candidateId(candidateId)
    	        .candidateEmail(candidateEmail)
    	        .jobId(jobId)
    	        .jobTitle(jobTitle)
    	        .previousStatus(prevStatus)
    	        .newStatus(newStatus)
    	        .feedback(feedback)
    	        .timestamp(LocalDateTime.now())
    	        .build();

        // Broadcast to Spring application event bus
        if (springEventPublisher != null) {
            springEventPublisher.publishEvent(event);
        }
        logger.info("[EVENT-BUS: Kafka topic 'application-notifications'] Published event: {}", event);
    }
}
