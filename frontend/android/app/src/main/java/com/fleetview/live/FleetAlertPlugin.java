package com.fleetview.live;

import android.content.Intent;
import android.Manifest;
import android.os.Build;

import com.getcapacitor.JSObject;
import com.getcapacitor.PermissionState;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;

@CapacitorPlugin(
    name = "FleetAlert",
    permissions = {
        @Permission(alias = "notifications", strings = { Manifest.permission.POST_NOTIFICATIONS })
    }
)
public class FleetAlertPlugin extends Plugin {

    @PluginMethod
    public void requestNotificationPermission(PluginCall call) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.TIRAMISU) {
            JSObject result = new JSObject();
            result.put("granted", true);
            call.resolve(result);
            return;
        }

        if (getPermissionState("notifications") == PermissionState.GRANTED) {
            JSObject result = new JSObject();
            result.put("granted", true);
            call.resolve(result);
            return;
        }

        requestPermissionForAlias("notifications", call, "notificationPermissionCallback");
    }

    private void notificationPermissionCallback(PluginCall call) {
        JSObject result = new JSObject();
        result.put("granted", getPermissionState("notifications") == PermissionState.GRANTED);
        call.resolve(result);
    }

    @PluginMethod
    public void startSiren(PluginCall call) {
        String title = call.getString("title", "Safe Zone Alert");
        String message = call.getString("message", "Vehicle exited safe zone.");

        Intent intent = new Intent(getContext(), SirenService.class);
        intent.setAction(SirenService.ACTION_START);
        intent.putExtra(SirenService.EXTRA_TITLE, title);
        intent.putExtra(SirenService.EXTRA_MESSAGE, message);

        getContext().startForegroundService(intent);

        JSObject result = new JSObject();
        result.put("started", true);
        call.resolve(result);
    }

    @PluginMethod
    public void stopSiren(PluginCall call) {
        Intent intent = new Intent(getContext(), SirenService.class);
        intent.setAction(SirenService.ACTION_STOP);

        getContext().startService(intent);

        JSObject result = new JSObject();
        result.put("stopped", true);
        call.resolve(result);
    }
}
