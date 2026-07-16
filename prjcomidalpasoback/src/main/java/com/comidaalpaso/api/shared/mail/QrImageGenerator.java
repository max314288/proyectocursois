package com.comidaalpaso.api.shared.mail;

public interface QrImageGenerator {
    /** PNG bytes, listos para codificar en base64 y embeber como data URI en el email. */
    byte[] generarPng(String contenido, int size);
}
