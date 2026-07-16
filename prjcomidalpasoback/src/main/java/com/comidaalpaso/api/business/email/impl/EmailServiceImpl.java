package com.comidaalpaso.api.business.email.impl;

import com.comidaalpaso.api.business.email.EmailService;
import com.comidaalpaso.api.business.pago.PagoService;
import com.comidaalpaso.api.business.pedido.PedidoService;
import com.comidaalpaso.api.resource.pago.model.PagoDTO;
import com.comidaalpaso.api.resource.pedido.model.ItemDetallePedidoDTO;
import com.comidaalpaso.api.resource.pedido.model.PedidoDetalleDTO;
import com.comidaalpaso.api.shared.mail.MailAdapter;
import com.comidaalpaso.api.shared.mail.QrImageGenerator;
import org.springframework.stereotype.Service;

import java.util.Base64;
import java.util.UUID;

@Service
public class EmailServiceImpl implements EmailService {

    private final PedidoService pedidoService;
    private final PagoService pagoService;
    private final MailAdapter mailAdapter;
    private final QrImageGenerator qrImageGenerator;

    public EmailServiceImpl(PedidoService pedidoService, PagoService pagoService,
                             MailAdapter mailAdapter, QrImageGenerator qrImageGenerator) {
        this.pedidoService = pedidoService;
        this.pagoService = pagoService;
        this.mailAdapter = mailAdapter;
        this.qrImageGenerator = qrImageGenerator;
    }

    @Override
    public void enviarComprobante(UUID pedidoId, String emailDestino) {
        PedidoDetalleDTO pedido = pedidoService.obtener(pedidoId);
        PagoDTO pago = pagoService.obtener(pedidoId);

        String qrDataUri = null;
        if ("efectivo".equals(pago.getMetodo()) && pedido.getCodigoQr() != null) {
            byte[] png = qrImageGenerator.generarPng(pedido.getCodigoQr(), 280);
            qrDataUri = "data:image/png;base64," + Base64.getEncoder().encodeToString(png);
        }

        String asunto = "Tu comprobante — Pedido #" + pedidoId.toString().substring(0, 8).toUpperCase();
        String html = construirHtml(pedidoId, pedido, pago, qrDataUri);
        mailAdapter.enviarHtml(emailDestino, asunto, html);
    }

    private String construirHtml(UUID pedidoId, PedidoDetalleDTO pedido, PagoDTO pago, String qrDataUri) {
        StringBuilder sb = new StringBuilder();
        sb.append("<div style=\"font-family:sans-serif;max-width:480px;margin:0 auto\">");
        sb.append("<h2 style=\"color:#823b18\">Comida al Paso</h2>");
        sb.append("<p>Pedido <strong>#").append(pedidoId.toString().substring(0, 8).toUpperCase())
          .append("</strong> — ").append(pedido.getRestaurante()).append("</p>");
        sb.append("<p>Fecha: ").append(pedido.getCreatedAt()).append("<br/>");
        sb.append("Método: ").append(formatMetodo(pago)).append("</p>");

        sb.append("<table style=\"width:100%;border-collapse:collapse;margin:16px 0\">");
        for (ItemDetallePedidoDTO item : pedido.getItems()) {
            sb.append("<tr><td style=\"padding:4px 0\">").append(item.getCantidad()).append("x ")
              .append(item.getItemNombre()).append("</td>")
              .append("<td style=\"padding:4px 0;text-align:right\">S/")
              .append(item.getPrecioUnitario()).append("</td></tr>");
        }
        sb.append("</table>");

        sb.append("<p style=\"font-weight:bold;font-size:18px\">Total: S/").append(pedido.getTotal()).append("</p>");

        if (qrDataUri != null) {
            sb.append("<div style=\"text-align:center;margin-top:16px\">")
              .append("<p>Muestra este código QR en el local para recoger tu pedido:</p>")
              .append("<img src=\"").append(qrDataUri).append("\" alt=\"Código QR\" width=\"200\" height=\"200\" />")
              .append("</div>");
        }

        sb.append("<p style=\"color:#888;font-size:12px;margin-top:24px\">Gracias por tu compra en Comida al Paso.</p>");
        sb.append("</div>");
        return sb.toString();
    }

    private String formatMetodo(PagoDTO pago) {
        if ("tarjeta".equals(pago.getMetodo())) {
            String ref = pago.getReferenciaExterna();
            return "Tarjeta" + (ref != null ? " •••• " + ref : "");
        }
        return "Pago en local";
    }
}
