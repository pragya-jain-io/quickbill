package com.quickbill.app;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;

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
}
