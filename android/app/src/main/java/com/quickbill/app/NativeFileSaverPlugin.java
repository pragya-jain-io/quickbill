
package com.quickbill.app;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.print.PrintAttributes;
import android.print.PrintDocumentAdapter;
import android.print.PrintManager;
import android.webkit.WebView;

import androidx.activity.result.ActivityResult;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.ActivityCallback;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.io.OutputStream;
import java.nio.charset.StandardCharsets;

@CapacitorPlugin(name = "NativeFileSaver")
public class NativeFileSaverPlugin extends Plugin {

    // Existing JSON backup functionality
    @PluginMethod
    public void saveJson(PluginCall call) {
        String fileName = call.getString("fileName");
        String content = call.getString("content");

        if (fileName == null || fileName.trim().isEmpty()) {
            call.reject("A file name is required.");
            return;
        }

        if (content == null) {
            call.reject("Backup content is missing.");
            return;
        }

        Intent intent = new Intent(Intent.ACTION_CREATE_DOCUMENT);
        intent.addCategory(Intent.CATEGORY_OPENABLE);
        intent.setType("application/json");
        intent.putExtra(Intent.EXTRA_TITLE, fileName);

        startActivityForResult(call, intent, "saveJsonResult");
    }

    @ActivityCallback
    private void saveJsonResult(PluginCall call, ActivityResult result) {
        if (call == null) {
            return;
        }

        if (result.getResultCode() != Activity.RESULT_OK) {
            JSObject response = new JSObject();
            response.put("cancelled", true);
            call.resolve(response);
            return;
        }

        Intent data = result.getData();

        if (data == null || data.getData() == null) {
            call.reject("No file destination was selected.");
            return;
        }

        Uri fileUri = data.getData();
        String content = call.getString("content");

        try (OutputStream outputStream =
                     getContext().getContentResolver().openOutputStream(fileUri, "w")) {

            if (outputStream == null) {
                call.reject("Could not open the selected file.");
                return;
            }

            outputStream.write(content.getBytes(StandardCharsets.UTF_8));
            outputStream.flush();

            JSObject response = new JSObject();
            response.put("saved", true);
            call.resolve(response);

        } catch (Exception error) {
            call.reject("Could not save the backup: " + error.getMessage(), error);
        }
    }

    // New Android native PDF printing functionality
    @PluginMethod
    public void printInvoice(PluginCall call) {
        String jobName = call.getString("jobName", "QuickBill Invoice");

        Activity activity = getActivity();

        if (activity == null) {
            call.reject("Android activity is unavailable.");
            return;
        }

        activity.runOnUiThread(() -> {
            try {
                PrintManager printManager =
                        (PrintManager) activity.getSystemService(Context.PRINT_SERVICE);

                WebView webView = getBridge().getWebView();

                if (printManager == null) {
                    call.reject("Android printing service is unavailable.");
                    return;
                }

                if (webView == null) {
                    call.reject("Invoice preview is unavailable.");
                    return;
                }

                PrintDocumentAdapter printAdapter =
                        webView.createPrintDocumentAdapter(jobName);

                PrintAttributes attributes = new PrintAttributes.Builder()
                        .setMediaSize(PrintAttributes.MediaSize.ISO_A4.asLandscape().asPortrait())
                        .setMinMargins(PrintAttributes.Margins.NO_MARGINS)
                        .setColorMode(PrintAttributes.COLOR_MODE_COLOR)
                        .build();

                printManager.print(jobName, printAdapter, attributes);

                JSObject response = new JSObject();
                response.put("started", true);
                call.resolve(response);

            } catch (Exception error) {
                call.reject(
                        "Could not start invoice printing: " + error.getMessage(),
                        error
                );
            }
        });
    }
}
