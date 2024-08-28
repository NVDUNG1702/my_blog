import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase.config";

export const blogAPI = {
    delete: async (collectionName, id) => {
        try {
            // Tạo tham chiếu tới tài liệu cần xoá
            const docRef = doc(db, collectionName, id);

            // Xoá tài liệu
            await deleteDoc(docRef);

            console.log(`Document with ID ${id} has been deleted successfully.`);
            
        } catch (error) {
            console.error("Error deleting document: ", error);
        }
    }
}