package com.comidaalpaso.api.shared.mail;

public interface MailAdapter {
    void enviarHtml(String destinatario, String asunto, String htmlBody);
}
