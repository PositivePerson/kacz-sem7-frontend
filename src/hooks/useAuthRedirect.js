// src/hooks/useAuthRedirect.js
import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";

export function useAuthRedirect() {
    const history = useHistory();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/auth/verify`, {
                    withCredentials: true,
                });

                // console.log("res from verify: ", res);
            } catch (err) {
                if (err.response?.status === 401) {
                    history.push("/login");
                }
            }
        };

        checkAuth();
    }, [history]);
}
