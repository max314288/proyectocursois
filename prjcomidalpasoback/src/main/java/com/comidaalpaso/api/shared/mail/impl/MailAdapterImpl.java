package com.comidaalpaso.api.shared.mail.impl;

import com.comidaalpaso.api.shared.exception.EmailEnvioException;
import com.comidaalpaso.api.shared.mail.MailAdapter;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

@Component
public class MailAdapterImpl implements MailAdapter {

    private final JavaMailSender mailSender;
    private final String from;

    public MailAdapterImpl(JavaMailSender mailSender, @Value("${mail.from}") String from) {
        this.mailSender = mailSender;
        this.from = from;
    }

    @Override
    public void enviarHtml(String destinatario, String asunto, String htmlBody) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(from);
            helper.setTo(destinatario);
            helper.setSubject(asunto);
            helper.setText(htmlBody, true);
            mailSender.send(message);
        } catch (MessagingException | RuntimeException e) {
            // RuntimeException amplio (no solo MailException) porque fallos de red/DNS/timeout
            // al hablar con el SMTP real pueden llegar envueltos en tipos que no son MailException.
            throw new EmailEnvioException("No se pudo enviar el correo a " + destinatario, e);
        }
    }
}
