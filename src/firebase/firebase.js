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
    await setDoc(doc(db, collection_name, doc_name), data);
  }
}

export async function update_equip_hvaing(equip) {
  const member_doc_ref = doc(db, "raid_members", equip.member_id);
  try {
    await runTransaction(db, async (transaction) => {
      transaction.update(member_doc_ref, {
        [equip.equip_type]: { having: !equip.having, token: equip.token },
      });
    });
    return true;
  } catch (e) {
    console.error(e);
    return false;
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
  equip_type_map
) {
  const layer_doc_ref = doc(db, "layer6.0", layer_id);
  try {
    await runTransaction(db, async (transaction) => {
      transaction.update(layer_doc_ref, {
        [equip_type]: equip_type_map,
      });
      return true;
    });
  } catch (e) {
    console.error(e);
    return false;
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
