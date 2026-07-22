(function (global) {
  "use strict";

  function getDeploymentNamespace(locationLike) {
    const currentLocation = locationLike || global.location || {};
    const protocol = String(currentLocation.protocol || "").toLowerCase();
    const hostname = String(currentLocation.hostname || "").toLowerCase();

    if (
      protocol !== "https:" ||
      hostname === "localhost" ||
      hostname.endsWith(".localhost") ||
      hostname.endsWith(".local") ||
      hostname === "0.0.0.0" ||
      hostname === "127.0.0.1" ||
      hostname === "[::1]"
    ) {
      return "local";
    }

    const firstSegment =
      String(currentLocation.pathname || "").split("/").filter(Boolean)[0] || "";

    if (firstSegment === "kids") {
      return "";
    }

    if (/^kids[1-9][0-9]*$/.test(firstSegment)) {
      return firstSegment;
    }

    return "local";
  }

  function makeStorageKey(baseKey, locationLike) {
    const namespace = getDeploymentNamespace(locationLike);
    return namespace ? `${baseKey}:${namespace}` : baseKey;
  }

  global.GameKidsDeployment = Object.freeze({
    getDeploymentNamespace,
    makeStorageKey
  });
})(typeof window === "undefined" ? globalThis : window);
