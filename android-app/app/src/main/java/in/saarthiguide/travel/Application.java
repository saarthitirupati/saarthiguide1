/*
 * Copyright 2020 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package in.saarthiguide.travel;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Context;
import android.os.Build;

public class Application extends android.app.Application {

  public static final String CHANNEL_ID = "saarthi_live_alerts_v4";
  public static final String CHANNEL_NAME = "Tirumala Live Alerts";

  @Override
  public void onCreate() {
      super.onCreate();
      createNotificationChannels();
  }

  private void createNotificationChannels() {
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
          try {
              NotificationManager notificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
              if (notificationManager != null) {
                  android.net.Uri soundUri = android.net.Uri.parse("android.resource://" + getPackageName() + "/" + R.raw.om_notification);
                  android.media.AudioAttributes audioAttributes = new android.media.AudioAttributes.Builder()
                          .setContentType(android.media.AudioAttributes.CONTENT_TYPE_SONIFICATION)
                          .setUsage(android.media.AudioAttributes.USAGE_NOTIFICATION)
                          .build();

                  NotificationChannel alertsChannel = new NotificationChannel(
                          "saarthi_alerts_v2",
                          "Saarthi Alerts",
                          NotificationManager.IMPORTANCE_HIGH
                  );
                  alertsChannel.setDescription("Live temple timings, crowd updates, and SSD token alerts");
                  alertsChannel.enableVibration(true);
                  alertsChannel.enableLights(true);
                  alertsChannel.setSound(soundUri, audioAttributes);
                  alertsChannel.setLockscreenVisibility(Notification.VISIBILITY_PUBLIC);
                  alertsChannel.setShowBadge(true);
                  notificationManager.createNotificationChannel(alertsChannel);

                  NotificationChannel liveChannel = new NotificationChannel(
                          CHANNEL_ID,
                          CHANNEL_NAME,
                          NotificationManager.IMPORTANCE_HIGH
                  );
                  liveChannel.setDescription("Urgent crowd, temple timing, and travel updates");
                  liveChannel.enableVibration(true);
                  liveChannel.enableLights(true);
                  liveChannel.setLockscreenVisibility(Notification.VISIBILITY_PUBLIC);
                  liveChannel.setShowBadge(true);
                  liveChannel.setSound(soundUri, audioAttributes);

                  notificationManager.createNotificationChannel(liveChannel);
              }
          } catch (Exception ignored) {
          }
      }
  }
}
