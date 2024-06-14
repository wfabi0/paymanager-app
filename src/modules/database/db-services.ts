import { invoke } from "@tauri-apps/api";
import { Payment } from "~/components/data-table/data-table";

async function createSetting(key: string, value: Payment) {
  try {
    await invoke("create_new_setting", {
      key,
      value: JSON.stringify(value),
    });
    return { key, value };
  } catch (e: Error | unknown) {
    if (e?.toString().includes("UNIQUE")) {
      return {
        error: e,
        message:
          "A payment with this name already exists, please use another name.",
      };
    }
    return { error: e };
  }
}

async function saveSettings(key: string, value: Payment) {
  try {
    await invoke("save_settings", {
      key,
      value: JSON.stringify(value),
    });
    return { key, value };
  } catch (e: Error | unknown) {
    return { error: e };
  }
}

async function getSettings(
  key: string
): Promise<{ value?: Payment; error?: any }> {
  try {
    const valueStr = await invoke<string>("get_setting", { key });
    const value: Payment = JSON.parse(valueStr.trim(), (key, value) =>
      key === "createdAt" || key === "updatedAt" || key === "dueAt"
        ? new Date(value)
        : value
    );
    return { value };
  } catch (e: Error | unknown) {
    return { error: e };
  }
}

async function getAllSettings() {
  try {
    const settings = await invoke<[]>("get_all_settings");
    return settings.map((table) => JSON.parse(table[1]));
  } catch (e: Error | unknown) {
    console.error("Erro ao buscar as configurações", e);
    return false;
  }
}

async function deleteSettings(key: string): Promise<boolean> {
  try {
    await invoke("delete_setting", { key });
    return true;
  } catch (e) {
    console.error("Erro ao deletar a configuração", e);
    return false;
  }
}

async function deleteAllSettings(): Promise<boolean> {
  try {
    await invoke("delete_all_settings");
    return true;
  } catch (e) {
    return false;
  }
}

async function updateSettings(key: string, value: Omit<Payment, "updatedAt">) {
  try {
    const { id, amount, dueAt, name, status, createdAt } = value;
    const update = await invoke("update_settings", {
      key,
      value: JSON.stringify({
        id,
        amount,
        dueAt,
        name,
        status,
        createdAt,
        updatedAt: new Date(),
      }),
    });
    return update;
  } catch (e: Error | unknown) {
    return false;
  }
}

async function initDb() {
  try {
    await invoke("init_db");
    return { message: "Database initialized" };
  } catch (e: Error | unknown) {
    return { error: e };
  }
}

async function testDb() {
  const week = new Date();
  week.setDate(week.getDate() + 1);
  const month = new Date();
  month.setMonth(month.getMonth() + 1);
  try {
    return true;
  } catch (e: Error | unknown) {
    return false;
  }
}

export const dbServices = {
  createSetting,
  saveSettings,
  getSettings,
  getAllSettings,
  deleteSettings,
  deleteAllSettings,
  updateSettings,
  initDb,
  testDb,
};
