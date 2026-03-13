#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::Serialize;
use tauri::command;

#[derive(Serialize)]
struct RegistryEntry {
  name: String,
  value: u32,
}

#[derive(Serialize)]
struct ResolutionInfo {
  width_entries: Vec<RegistryEntry>,
  height_entries: Vec<RegistryEntry>,
}

#[command]
fn set_resolution(width: u32, height: u32) -> Result<(), String> {
  if width == 0 || height == 0 {
    return Err("Width and height must be positive integers".to_string());
  }

  #[cfg(windows)]
  {
    use winreg::enums::{HKEY_CURRENT_USER, KEY_READ, KEY_WRITE};
    use winreg::RegKey;

    const KEY_PATH: &str = r"Software\Hypergryph\Endfield";
    const WIDTH_PREFIXES: [&str; 3] = [
      "screenmanager resolution width_h",
      "screenmanager resolution window width_h",
      "video_resolution_width_h",
    ];
    const HEIGHT_PREFIXES: [&str; 3] = [
      "screenmanager resolution height_h",
      "screenmanager resolution window height_h",
      "video_resolution_height_h",
    ];

    let hkcu = RegKey::predef(HKEY_CURRENT_USER);
    let key = hkcu
      .open_subkey_with_flags(KEY_PATH, KEY_READ | KEY_WRITE)
      .map_err(|error| format!("Failed to open registry key: {error}"))?;

    let mut width_keys: Vec<String> = Vec::new();
    let mut height_keys: Vec<String> = Vec::new();

    for entry in key.enum_values() {
      let (name, _value) = entry.map_err(|error| format!("Failed to enumerate values: {error}"))?;
      let name_lower = name.to_lowercase();
      if WIDTH_PREFIXES.iter().any(|prefix| name_lower.starts_with(prefix)) {
        width_keys.push(name);
      } else if HEIGHT_PREFIXES.iter().any(|prefix| name_lower.starts_with(prefix)) {
        height_keys.push(name);
      }
    }

    if width_keys.is_empty() && height_keys.is_empty() {
      return Err("No matching resolution values found".to_string());
    }

    for name in width_keys {
      key.set_value(name, &width)
        .map_err(|error| format!("Failed to set width value: {error}"))?;
    }

    for name in height_keys {
      key.set_value(name, &height)
        .map_err(|error| format!("Failed to set height value: {error}"))?;
    }

    return Ok(());
  }

  #[cfg(not(windows))]
  {
    Err("This feature is only supported on Windows.".to_string())
  }
}

#[command]
fn get_resolution_info() -> Result<ResolutionInfo, String> {
  #[cfg(windows)]
  {
    use winreg::enums::{HKEY_CURRENT_USER, KEY_READ};
    use winreg::RegKey;

    const KEY_PATH: &str = r"Software\Hypergryph\Endfield";
    const WIDTH_PREFIXES: [&str; 3] = [
      "screenmanager resolution width_h",
      "screenmanager resolution window width_h",
      "video_resolution_width_h",
    ];
    const HEIGHT_PREFIXES: [&str; 3] = [
      "screenmanager resolution height_h",
      "screenmanager resolution window height_h",
      "video_resolution_height_h",
    ];

    let hkcu = RegKey::predef(HKEY_CURRENT_USER);
    let key = hkcu
      .open_subkey_with_flags(KEY_PATH, KEY_READ)
      .map_err(|error| format!("Failed to open registry key: {error}"))?;

    let mut width_entries: Vec<RegistryEntry> = Vec::new();
    let mut height_entries: Vec<RegistryEntry> = Vec::new();

    for entry in key.enum_values() {
      let (name, _value) = entry.map_err(|error| format!("Failed to enumerate values: {error}"))?;
      let name_lower = name.to_lowercase();
      if WIDTH_PREFIXES.iter().any(|prefix| name_lower.starts_with(prefix)) {
        let value: u32 = key
          .get_value(&name)
          .map_err(|error| format!("Failed to read registry value {name}: {error}"))?;
        width_entries.push(RegistryEntry { name, value });
      } else if HEIGHT_PREFIXES.iter().any(|prefix| name_lower.starts_with(prefix)) {
        let value: u32 = key
          .get_value(&name)
          .map_err(|error| format!("Failed to read registry value {name}: {error}"))?;
        height_entries.push(RegistryEntry { name, value });
      }
    }

    return Ok(ResolutionInfo {
      width_entries,
      height_entries,
    });
  }

  #[cfg(not(windows))]
  {
    Err("This feature is only supported on Windows.".to_string())
  }
}

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![set_resolution, get_resolution_info])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
