//define(["FSClass","NativeFS","LSFS", "WebFS", "PathUtil","Env","assert","SFile","RootFS","Content","zip","DeferredUtil","promise"],
//        function (FSClass,NativeFS,LSFS,WebFS, P,Env,A,SFile,RootFS,Content,zip,DU,PR) {
import A from "./assert.js";
import Content from "./Content.js";
import FSClass from "./FSClass.js";
import DU from "./DeferredUtil.js";
import PR from "./promise.js";
import Env from "./Env.js";
import NativeFS from "./NativeFS.js";
import SFile from "./SFile.js";
import RootFS from "./RootFS.js";
import LSFS from "./LSFS.js";
import P from "./PathUtil.js";
import WebFS from "./WebFS.js";
import zip from "./zip.js";
var FS = {};
FS.assert = A;
FS.Content = Content;
FS.Class = FSClass;
FS.DeferredUtil = DU;
if (!DU.config.useJQ) {
    DU.external.Promise = PR;
}
FS.Env = Env;
FS.LSFS = LSFS;
FS.NativeFS = NativeFS;
FS.PathUtil = P;
FS.RootFS = RootFS;
FS.SFile = SFile;
FS.WebFS = WebFS;
FS.zip = zip;
//if (zip.JSZip) DU.external.Promise=zip.JSZip.external.Promise;
if (typeof window == "object") window.FS = FS;
var rootFS;
var env = new Env({});
FS.addFSType = FSClass.addFSType;
FS.availFSTypes = FSClass.availFSTypes;

FS.setEnvProvider = function (e) {
    env = e;
};
FS.getEnvProvider = function () {
    return env;
};
FS.setEnv = function (key, value) {
    if (typeof key == "object") {
        for (var k in key) {
            env.set(k, key[k]);
        }
    } else {
        env.set(key, value);
    }
};
FS.getEnv = function (key) {
    if (typeof key == "string") {
        return env.get(key);
    } else {
        return env.value;
    }
};
FS.localStorageAvailable = function () {
    try {
        // Fails when Secret mode + iframe in other domain
        return (typeof localStorage === "object");
    } catch (e) {
        return false;
    }
};
FS.init = function (fs) {
    if (rootFS) return;
    if (!fs) {
        if (NativeFS.available) {
            fs = new NativeFS();
        } else if (FS.localStorageAvailable()) {
            fs = new LSFS(localStorage);
        } else if (typeof importScripts === "function") {
            // Worker
            /* global self*/
            self.addEventListener("message", function (e) {
                var data = e.data;
                if (typeof data === "string") {
                    data = JSON.parse(data);
                }
                switch (data.type) {
                    case "upload":
                        FS.get(data.base).importFromObject(data.data);
                        break;
                    case "observe":
                        rootFS.observe(data.path, function (path, meta) {
                            self.postMessage(JSON.stringify({
                                type: "changed",
                                path: path,
                                content: FS.get(path).text(),
                                meta: meta
                            }));
                        });
                        break;
                }
            });
            fs = LSFS.ramDisk();
        } else {
            fs = LSFS.ramDisk();
        }
    }
    rootFS = new RootFS(fs);
};
FS.getRootFS = function () {
    FS.init();
    return rootFS;
};
FS.get = function () {
    FS.init();
    return rootFS.get.apply(rootFS, arguments);
};
FS.expandPath = function () {
    return env.expandPath.apply(env, arguments);
};
FS.resolve = function (path, base) {
    FS.init();
    if (SFile.is(path)) return path;
    path = env.expandPath(path);
    if (base && !P.isAbsolutePath(path)) {
        base = env.expandPath(base);
        return FS.get(base).rel(path);
    }
    return FS.get(path);
};
FS.mount = function () {
    FS.init();
    return rootFS.mount.apply(rootFS, arguments);
};
FS.unmount = function () {
    FS.init();
    return rootFS.unmount.apply(rootFS, arguments);
};
FS.isFile = function (f) {
    return SFile.is(f);
};
export default FS;
//});
