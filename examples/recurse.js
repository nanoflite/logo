function recurse(n) {
    console.log(`0, ${n}`)
    if (n == 0) {
        return
    }
    console.log(`1, ${n}`)
    n = n -1
    for(let i=0; i<2; i++) {
        recurse(n);
        recurse(n);

    }
}
recurse(3)
