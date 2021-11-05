
function zip_ext(){
    echo "zipping extension ....."
    zip webpage_reader_ext.zip -j src/*
}

function git_add_commit_push(){

    echo "executing git add ... "
    git add .

    echo "executing git commit..."

    git commit -m $1

    echo "executing git push ..."

    git push

}

zip_ext