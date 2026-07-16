package com.comidaalpaso.api.shared.mail.impl;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.comidaalpaso.api.shared.exception.EmailEnvioException;
import com.comidaalpaso.api.shared.mail.QrImageGenerator;
import org.springframework.stereotype.Component;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

@Component
public class QrImageGeneratorImpl implements QrImageGenerator {

    @Override
    public byte[] generarPng(String contenido, int size) {
        try {
            BitMatrix matrix = new QRCodeWriter().encode(contenido, BarcodeFormat.QR_CODE, size, size);
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(matrix, "PNG", out);
            return out.toByteArray();
        } catch (WriterException | IOException e) {
            throw new EmailEnvioException("No se pudo generar el código QR", e);
        }
    }
}
