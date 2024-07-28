# @hoge1e3/fs
File System for Browser using localStorage.

## Build

```
npm install
npm run build
```

## Test

```
npm run test
```

If "All test Passed." is shown, the test is succeeded.

### Example
`FS.get` method returns a File Object which can access to localStorage.

(See ./example.html)
```
<script src="path/to/FS.js"></script>
<script>
    var mydir=FS.get("/mydir/");// Directory in localStorage
    var myfile=mydir.rel("myfile.txt");  // File in localStorage (/mydir/myfile.txt)
    myfile.text("my content"); // write file
    console.log(myfile.text()); // read file
    for (let f of mydir.listFiles()) { // list files in mydir
        console.log(f.name());
    }
</script>
```

## Quick Reference of File Object

- File Object can be get by calling `FS.get(path)`. 
- In the methods listed below, `f` and `d` is a File Object which represents a file and directory respectively. `fd` can be either file or directory.
- If filepath or filename represents directory, `/` MUST be present at last of filepath or filename

* `f.text(str)`   write `str` to the file
* `f.text()`   returns file content of the file in string 
* `f.obj(o)` write object `o` in JSON to the file  
* `f.obj()` returns the file content as object. The content of the file should be written in JSON 
* `f.bytes(b)` write ArrayBuffer/Buffer(node) to the file  
* `f.bytes()` returns file content as ArrayBuffer(browser)/Buffer(node)
* `f.getBytes({binType:ArrayBuffer})` returns file content as ArrayBuffer(both in browser and node)
* `d.each(func)` iterates over the directory by passing each File Object to `func`
* `d.recursive(func)` iterates over all files in the directory and its subdirectory by passing each File Object to `func`
* `d.recursive()` returns Generator which iterates over all files in the directory and its subdirectory.
* `d.listFiles()` returns array of File Objects which represents all files in the directory
* `d.ls()` returns array of names of all files in the directory
* `d.rel(relPath)` returns new File Object specified by the relative path
* `fd.relPath(base)` returns the relative path of the file from the `base` File Object.
* `fd.up()` returns new File Object which is parent of the file/directory.
* `fd.sibling(name)` same as `fd.up().rel(name)`.
* `fd.path()` returns the full path of the file/directory.
* `fd.name()` returns the name of the file/directory.
* `fd.ext()` returns the extention of the file/directory.
* `fd.truncExt(e)` returns the name removing `e` (when `e` is omitted, `e` equals to `fd.ext()` )
* `f.lastUpdate()` return the file's time stamp as the number corrensponding to the value of Date.getTime
* `f.rm()` removes the file
* `d.rm()` removes the directory if it is empty.
* `d.rm({r:true})` removes the directory and all subfiles/subdirectories.
* `fd.exists()` checks whether the file/directory exists.
* `fd.isDir()` checks whether the File Object is directory.
* `f.copyFrom(src)` copies from src(File Object) to the file.
   - If `src` is a directory. It is same as `cp -R src/* f/*` in unix command. NOT `cp src/ f/`.
* `f.copyTo(dst)` copies the file to dst(File Object).
   - It is same as `cp -R f/* dst/*`, NOT `cp f/ dst/`.
* `f.moveFrom(src)` moves from src(File Object) to the file. 
* `f.moveTo(dst)` moves the file to dst(File Object).
* `d.mkdir()` creates the directory.

## Use of RAM disk

You can also use RAM disk to store temporal data to memory, that is destroyed when leaving the page. 
```
FS.mount("/tmp/",FS.LSFS.ramDisk());
```
After that the path beginning with `/tmp/` is stored in memory.


## Representation of files in localStorage

- The key represents the full path of a file. 
- The value represents the file content in string
    - If the file is a binary file, it is stored in data url.
    - Whether the file is binary or text is determined by extension of the file
    - `src/MIMETypes.js` maps extension to content types. If content type is "text/....", it is regarded as text file
- The key of a directory entry always ends with /
    - The value is a JSON with file list and attributes(lastUpdate).
