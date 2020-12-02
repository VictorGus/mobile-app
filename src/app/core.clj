(ns app.core
  (:require [clojure.java.io :as io]
            [route-map.core  :as rm]
            [app.manifest    :as m]
            [cheshire.core   :as json]
            [ring.middleware.reload :refer [wrap-reload]]
            [ring.middleware.cors   :refer [wrap-cors]]
            [ring.middleware.params :refer [wrap-params]]
            [ring.middleware.json   :refer [wrap-json-response wrap-json-body]]
            [app.dbcore  :as db]
            [app.crud    :as crud]
            [org.httpkit.server :as server]
            [clojure.string     :as str])
  (:gen-class))

(defn routes [ctx]
  {"notification"        {:GET  (crud/read-entity   ctx :notification)
                          :POST (crud/create-entity ctx :notification)
                          [:id] {:GET    (crud/read-entity   ctx :notification)
                                 :DELETE (crud/delete-entity ctx :notification)
                                 :PATCH  (crud/patch-entity  ctx :notification)
                                 :PUT    (crud/update-entity ctx :notification)}}
   "notification-result" {:GET  (crud/read-entity ctx   :notification_result)
                          :POST (crud/create-entity ctx :notification_result)
                          [:id] {:GET    (crud/read-entity   ctx :notification_result)
                                 :DELETE (crud/delete-entity ctx :notification_result)
                                 :PATCH  (crud/patch-entity  ctx :notification_result)
                                 :PUT    (crud/update-entity ctx :notification_result)}}
   "user"                {:GET  (crud/read-entity ctx   :public_user)
                          :POST (crud/create-entity ctx :public_user)
                          [:id] {:GET    (crud/read-entity   ctx :public_user)
                                 :DELETE (crud/delete-entity ctx :public_user)
                                 :PATCH  (crud/patch-entity  ctx :public_user)
                                 :PUT    (crud/update-entity ctx :public_user)}}
   "settings"            {:GET  (crud/read-entity ctx   :settings)
                          :POST (crud/create-entity ctx :settings)
                          [:id] {:GET    (crud/read-entity   ctx :settings)
                                 :DELETE (crud/delete-entity ctx :settings)
                                 :PATCH  (crud/patch-entity  ctx :settings)
                                 :PUT    (crud/update-entity ctx :settings)}}})

(defn params-to-keyword [params]
  (reduce-kv (fn [acc k v]
               (assoc acc (keyword k) v)) {} params))

(defn handler [ctx]
  (fn [{meth :request-method uri :uri :as req}]
    (if-let [res (rm/match [meth uri] (routes ctx))]
      ((:match res) (-> (assoc req :params (params-to-keyword (:params req)))
                        (update-in [:params] merge (:params res))))
      {:status 404 :body {:error "Not found"}})))

(defn preflight
  [{meth :request-method hs :headers :as req}]
  (let [headers (get hs "access-control-request-headers")
        origin (get hs "origin")
        meth  (get hs "access-control-request-method")]
    {:status 200
     :headers {"Access-Control-Allow-Headers" headers
               "Access-Control-Allow-Methods" meth
               "Access-Control-Allow-Origin" origin
               "Access-Control-Allow-Credentials" "true"
               "Access-Control-Expose-Headers" "Location, Transaction-Meta, Content-Location, Category, Content-Type, X-total-count"}}))

(defn allow [resp req]
  (let [origin (get-in req [:headers "origin"])]
    (update resp :headers merge
            {"Access-Control-Allow-Origin" origin
             "Access-Control-Allow-Credentials" "true"
             "Access-Control-Expose-Headers" "Location, Content-Location, Category, Content-Type, X-total-count"})))

(defn handle-input-stream [{:keys [body]}]
  (if (and body
           (instance? org.httpkit.BytesInputStream body))
    (json/parse-string (slurp body) true)
    body))

(defn mk-handler [dispatch]
  (fn [{headers :headers uri :uri :as req}]
    (if (= :options (:request-method req))
      (preflight req)
      (let [req (merge req {:body (handle-input-stream req)})
            _ (println req)
            resp (dispatch req)]
        (-> resp (allow req))))))

(defn app [ctx]
  (-> (handler ctx)
      mk-handler
      wrap-json-body
      wrap-params
      wrap-json-response
      wrap-reload))

(defonce state (atom nil))

(defn stop-server []
  (when-not (nil? @state)
    (@state :timeout 100)
    (reset! state nil)))

(defn start-server []
  (let [app* (app db/pool-config)]
    (reset! state (server/run-server app* {:port (as-> (get-in m/app-config [:app :port]) port
                                                  (cond-> port
                                                    (string? port)
                                                    Integer/parseInt))}))))

(defn restart-server [] (stop-server) (start-server))

(defn -main [& [_ _]]
  (start-server)
  (println "Server started"))

(comment
  (restart-server)
  )
