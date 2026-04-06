package com.fleetview.live;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

public class StopSirenReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        Intent stopIntent = new Intent(context, SirenService.class);
        stopIntent.setAction(SirenService.ACTION_STOP);
        context.startService(stopIntent);
    }
}
