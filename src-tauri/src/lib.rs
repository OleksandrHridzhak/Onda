use tauri::Window;

#[tauri::command]
fn minimize_window(window: Window) {
  window.minimize().unwrap();
}

#[tauri::command]
fn maximize_window(window: Window) {
  if window.is_maximized().unwrap() {
    window.unmaximize().unwrap();
  } else {
    window.maximize().unwrap();
  }
}

#[tauri::command]
fn close_window(window: Window) {
  window.hide().unwrap();
}

#[tauri::command]
fn close_app(app: tauri::AppHandle) {
  app.exit(0);
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .plugin(tauri_plugin_notification::init())
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      Ok(())
    })
    .invoke_handler(tauri::generate_handler![
      minimize_window,
      maximize_window,
      close_window,
      close_app
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
