
//%block="character grid encoder"
//%icon="\uf468"
//%color="#40de9c"
namespace chargridnum {

    let idxValKey: {[key:string]:number} = {}

    //%block="$name"
    //%blockId=chargrid_indexkeyshadow
    //%blockHidden=true shim=TD_ID
    //%name.fieldEditor="autocomplete" name.fieldOptions.decompileLiterals=true
    //%name.fieldOptions.key="chargrid_IndexKey"
    export function _indexKeyShadow(name: string) {
        return name
    }

    //%blockid=chargrid_setindexkey
    //%block="set index key as $name by $val"
    //%name.shadow=chargrid_indexkeyshadow name.defl="myIdxKey"
    //%group="index key"
    //%weight=10
    export function setIdxKey(name:string,val:number) {
        idxValKey[name] = val
    }

    //%blockid=chargrid_getindexkey
    //%block="get index key as $name"
    //%name.shadow=chargrid_indexkeyshadow name.defl="myIdxKey"
    //%group="index key"
    //%weight=5
    export function getIdxKey(name:string) {
        if (!idxValKey[name]) return -1
        return idxValKey[name]
    }

    //%blockid=chargrid_writeandencode
    //%block="write $txt"
    //%group="main"
    //%weight=10
    export function write(txt:string) {
        let charw = 2, charlen = 0
        for (let val of txt.split("")) charlen = Math.max(charlen,val.charCodeAt(0))
        while (charw * charw < charlen) charw += charw
        let utxt = "", ccol = -1,crow = -1,ncol = 0,nrow = 0,cnum = 0
        utxt = utxt + "9" + (charw.toString().length).toString() + charw.toString()
        for (let val of txt.split("")) {
            cnum = val.charCodeAt(0), ncol = cnum % charw, nrow = Math.floor(cnum / charw)
            if (nrow != crow) {
                crow = nrow, utxt = utxt + "6" + (crow.toString().length).toString() + crow.toString()
            }
            ccol = ncol, utxt = utxt + "3" + (ccol.toString().length).toString() + ccol.toString()
        }
        utxt = utxt + "0"
        return utxt
    }

    //%blockid=chargrid_readanddecode
    //%block="read $txt with $name as index key"
    //%name.shadow=chargrid_indexkeyshadow name.defl="myIdxKey"
    //%group="main"
    //%weight=5
    export function read(txt:string,name:string) {
        for (let v of txt.split("")) {
            const nv = parseInt(v)
            if (v != nv.toString()) return ""
        }
        let curidx = idxValKey[name], ccol = 0, crow = 0, cnum = 0, cwid = 0, clen = 0, utxt = "", subchar = "", curchar = "", charcm = ""
        while (curidx < txt.length) {
            charcm = txt.charAt(curidx)
            if (["9","6","3","0"].indexOf(charcm) < 0) break;
            if (charcm == "9") {
                curidx += 1, clen = parseInt(txt.charAt(curidx))
                curidx += 1, cwid = parseInt(txt.substr(curidx,clen))
                curidx += clen
            } else if (charcm == "6") {
                curidx += 1, clen = parseInt(txt.charAt(curidx))
                curidx += 1, crow = parseInt(txt.substr(curidx, clen))
                curidx += clen
            } else if (charcm == "3") {
                curidx += 1, clen = parseInt(txt.charAt(curidx))
                curidx += 1, ccol = parseInt(txt.substr(curidx, clen))
                curidx += clen, cnum = (crow * cwid) + ccol
                utxt += String.fromCharCode(cnum)
            } else if (charcm == "0") {
                break
            } else {
                curidx++
            }
        }
        curidx += 1
        idxValKey[name] = curidx
        return utxt
    }
}
