import { initializeApp } from "firebase/app";
import {
  getFirestore,
  getDoc,
  doc,
  getDocs,
  query,
  collection,
  setDoc,
  runTransaction,
} from "firebase/firestore";

const config = {
  apiKey: process.env.VUE_APP_API_KEY,
  authDomain: process.env.VUE_APP_AUTH_DOMAIN,
  databaseURL: process.env.VUE_APP_DATABASE_URL,
  projectId: process.env.VUE_APP_PROJECT_ID,
  storageBucket: process.env.VUE_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_AP_ID,
  measurementId: process.env.VUE_APP_MEASUREMENT_ID,
};

console.log(config); // 参照出来ているかの確認用

const firestore = getFirestore(initializeApp(config));

const db = firestore;

export function check_db_exists() {
  return db !== null;
}

export async function get_doc(collection_name, doc_name) {
  let result;

  if (check_db_exists()) {
    result = await getDoc(doc(db, collection_name, doc_name));
  }

  return result;
}

export async function fetch_collection(collection_name) {
  let result;
  if (check_db_exists()) {
    result = (await getDocs(query(collection(db, collection_name)))).docs;
  }
  return result;
}

export async function set_doc(collection_name, doc_name, data) {
  if (check_db_exists()) {
    await setDoc(doc(db, collection_name, doc_name), data, { merge: true });
  }
}

export async function update_equip_hvaing(equip) {
  const member_doc_ref = doc(db, "raid_members", equip.member_id);
  let message = "所持状況の更新に失敗しました。";
  let result_data = {};
  let result = false;
  try {
    await runTransaction(db, async (transaction) => {
      const member_doc = await transaction.get(member_doc_ref);
      const equip_info = member_doc.data()[equip.equip_type];
      if (equip_info.having === equip.having) {
        equip_info.having = !equip_info.having;
        transaction.update(member_doc_ref, {
          [equip.equip_type]: { ...equip_info },
        });
        message = "所持状況を更新しました。";
        equip.having = !equip.having;
        result_data = equip;
        result = true;
      } else {
        result_data = equip_info;
        message = "所持状況が更新されていました。";
      }
    });
    return { message, result, data: result_data };
  } catch (e) {
    console.error(e);
    return { message, result, data: result_data };
  }
}

export async function update_token_state(equip) {
  const member_doc_ref = doc(db, "raid_members", equip.member_id);
  const change_state = (currentState) => {
    if (currentState === "none") {
      return "have";
    } else if (currentState === "have") {
      return "reinforce";
    } else {
      return "none";
    }
  };
  let message = "所持状況の更新に失敗しました。";
  let result_data = {};
  let result = false;
  try {
    await runTransaction(db, async (transaction) => {
      const member_doc = await transaction.get(member_doc_ref);
      const equip_info = member_doc.data()[equip.equip_type];
      if (equip_info.token_state === equip.state) {
        equip_info.token_state = change_state(equip.state);
        equip.state = equip_info.token_state;
        transaction.update(member_doc_ref, {
          [equip.equip_type]: { ...equip_info },
        });
        message = "所持状況を更新しました。";
        result_data = equip;
        result = true;
      } else {
        result_data = equip_info;
        message = "所持状況が更新されていました。";
      }
    });
    return { message, result, data: result_data };
  } catch (e) {
    console.error(e);
    return { message, result, data: result_data };
  }
}

// export async function update_layer_equip_count(
//   layer_id,
//   equip_type,
//   member_name,
//   count,
//   is_plus
// ) {
//   const layer_doc_ref = doc(db, "layer6.0", layer_id);
//   try {
//     const response = await runTransaction(db, async (transaction) => {
//       const layer_doc = await transaction.get(layer_doc_ref);
//       if (!layer_doc.exists()) {
//         throw "Document does not exist!";
//       }
//       const equip_count_by_member_list = layer_doc.data()[equip_type];
//       transaction.update(layer_doc_ref, {
//         [equip_type]: arrayRemove(...equip_count_by_member_list),
//       });

//       const updated_equip_count_by_member_list = update_equip_count(
//         equip_count_by_member_list,
//         member_name,
//         is_plus
//       );

//       transaction.update(layer_doc_ref, {
//         [equip_type]: arrayUnion(...updated_equip_count_by_member_list),
//       });
//       return updated_equip_count_by_member_list;
//     });
//     console.log(response);
//   } catch (e) {
//     console.error(e);
//   }
// }

export async function update_layer_equip_count(
  layer_id,
  equip_type,
  equip_type_map,
  member_name,
  count
) {
  const layer_doc_ref = doc(db, "layer6.0", layer_id);
  let message = "所持数の更新に失敗しました。";
  let result_data = {};
  let result = false;
  try {
    await runTransaction(db, async (transaction) => {
      const layer_doc = await transaction.get(layer_doc_ref);
      const layer_data = layer_doc.data();
      const equip_data = layer_data[equip_type];
      if (count === equip_data[member_name]) {
        transaction.update(layer_doc_ref, {
          [equip_type]: equip_type_map,
        });
        message = "所持数を更新しました。";
        result_data = equip_type_map;
        result = true;
      } else {
        result_data = equip_data;
        message = "所持数が更新されていました。";
      }
    });
    return {
      message,
      data: result_data,
      result,
    };
  } catch (e) {
    console.error(e);
    return {
      message,
      data: result_data,
      result,
    };
  }
}

export function update_equip_count(
  equip_count_by_member_list,
  member_name,
  is_plus
) {
  return equip_count_by_member_list.map((equip_count) => {
    if (equip_count[member_name] != null) {
      if (is_plus) {
        return { [member_name]: equip_count[member_name] + 1 };
      } else if (equip_count[member_name] > 0) {
        return { [member_name]: equip_count[member_name] - 1 };
      }
    }
    return equip_count;
  });
}
