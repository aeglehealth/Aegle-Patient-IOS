
#import "AppDelegate.h"

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import "RNSplashScreen.h"
#import <FBSDKCoreKit/FBSDKCoreKit.h>
#import <Firebase.h>
#import "RNFBMessagingModule.h"
#import <CodePush/CodePush.h>
#import <AppCenterReactNative.h>
#import <AppCenterReactNativeAnalytics.h>
#import <AppCenterReactNativeCrashes.h>
#import <UserNotifications/UserNotifications.h>
#import <RNCPushNotificationIOS.h>

@import Firebase;

#if DEBUG
#import <FlipperKit/FlipperClient.h>
#import <FlipperKitLayoutPlugin/FlipperKitLayoutPlugin.h>
#import <FlipperKitUserDefaultsPlugin/FKUserDefaultsPlugin.h>
#import <FlipperKitNetworkPlugin/FlipperKitNetworkPlugin.h>
#import <SKIOSNetworkPlugin/SKIOSNetworkAdapter.h>
#import <FlipperKitReactPlugin/FlipperKitReactPlugin.h>

static void InitializeFlipper(UIApplication *application) {
  FlipperClient *client = [FlipperClient sharedClient];
  SKDescriptorMapper *layoutDescriptorMapper = [[SKDescriptorMapper alloc] initWithDefaults];
  [client addPlugin:[[FlipperKitLayoutPlugin alloc] initWithRootNode:application withDescriptorMapper:layoutDescriptorMapper]];
  [client addPlugin:[[FKUserDefaultsPlugin alloc] initWithSuiteName:nil]];
  [client addPlugin:[FlipperKitReactPlugin new]];
  [client addPlugin:[[FlipperKitNetworkPlugin alloc] initWithNetworkAdapter:[SKIOSNetworkAdapter new]]];
  [client start];
	}
	#endif

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  #if DEBUG
    InitializeFlipper(application);
  #endif

  if ([FIRApp defaultApp] == nil) {
    [FIRApp configure];
  }

  // if ([UNUserNotificationCenter class] != nil) {
  //   // iOS 10 or later
  //   // For iOS 10 display notification (sent via APNS)
  //   [UNUserNotificationCenter currentNotificationCenter].delegate = self;
  //   UNAuthorizationOptions authOptions = UNAuthorizationOptionAlert |
  //       UNAuthorizationOptionSound | UNAuthorizationOptionBadge;
  //   [[UNUserNotificationCenter currentNotificationCenter]
  //       requestAuthorizationWithOptions:authOptions
  //       completionHandler:^(BOOL granted, NSError * _Nullable error) {
  //         // ...
  //       }];
  // } else {
  //   // iOS 10 notifications aren't available; fall back to iOS 8-9 notifications.
  //   UIUserNotificationType allNotificationTypes =
  //   (UIUserNotificationTypeSound | UIUserNotificationTypeAlert | UIUserNotificationTypeBadge);
  //   UIUserNotificationSettings *settings =
  //   [UIUserNotificationSettings settingsForTypes:allNotificationTypes categories:nil];
  //   [application registerUserNotificationSettings:settings];
  // }

  // [application registerForRemoteNotifications];
  
  // [FIRMessaging messaging].delegate = self;
  // [FIRMessaging messaging].autoInitEnabled = YES;
  
  [[FIRInstanceID instanceID] instanceIDWithHandler:^(FIRInstanceIDResult * _Nullable result,
                                                      NSError * _Nullable error) {
    if (error != nil) {
      NSLog(@"Error fetching remote instance ID: %@", error);
    } else {
      NSLog(@"Remote instance ID token: %@", result.token);
    }
  }];
  
  
  [AppCenterReactNative register];
  [AppCenterReactNativeAnalytics registerWithInitiallyEnabled:true];
  [AppCenterReactNativeCrashes registerWithAutomaticProcessing];

  NSMutableDictionary * appProperties = [RNFBMessagingModule addCustomPropsToUserProps:nil withLaunchOptions:launchOptions];

  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:@"medical_new"
                                            initialProperties:appProperties];

  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];

  [[FBSDKApplicationDelegate sharedInstance] application:application
  didFinishLaunchingWithOptions:launchOptions];
  
  [RNSplashScreen show];

  UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
  center.delegate = self;

  return YES;
}

- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {
BOOL handled = [[FBSDKApplicationDelegate sharedInstance] application:application openURL:url sourceApplication:options[UIApplicationOpenURLOptionsSourceApplicationKey] annotation:options[UIApplicationOpenURLOptionsAnnotationKey]
];
// Add any custom logic here.
return handled;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  return [CodePush bundleURL];
#endif
}

// // Required to register for notifications
// - (void)application:(UIApplication *)application didRegisterUserNotificationSettings:(UIUserNotificationSettings *)notificationSettings
// {
//  [RNCPushNotificationIOS didRegisterUserNotificationSettings:notificationSettings];
// }
// // Required for the register event.
// - (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
// {
//  [RNCPushNotificationIOS didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
// }
// // Required for the notification event. You must call the completion handler after handling the remote notification.
// - (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo
// fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler
// {
//   [RNCPushNotificationIOS didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
// }
// // Required for the registrationError event.
// - (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error
// {
//  [RNCPushNotificationIOS didFailToRegisterForRemoteNotificationsWithError:error];
// }
// // IOS 10+ Required for localNotification event
// - (void)userNotificationCenter:(UNUserNotificationCenter *)center
// didReceiveNotificationResponse:(UNNotificationResponse *)response
//          withCompletionHandler:(void (^)(void))completionHandler
// {
//   [RNCPushNotificationIOS didReceiveNotificationResponse:response];
//   completionHandler();
// }
// // IOS 4-10 Required for the localNotification event.
// - (void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification
// {
//  [RNCPushNotificationIOS didReceiveLocalNotification:notification];
// }

// -(void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions options))completionHandler
// {
//   completionHandler(UNAuthorizationOptionSound | UNAuthorizationOptionAlert | UNAuthorizationOptionBadge);
// }

@end
