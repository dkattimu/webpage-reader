
function zip_ext(){

    echo "zipping extension ....."
    zip webpage_reader_ext.zip -j src/*
}

function git_add_commit_push(){
    commit_msg=$1
    echo "executing git add ... "
    git add .

    echo "executing git commit..."

    git commit -m $commit_msg

    echo "executing git push ..."

    git push
}

function zip_add_commit_push(){
    
    commit_msg=$1
    zip_ext
   
    echo "executing git add ... "
    git add .

    echo "executing git commit..."
    git commit -m $commit_msg

    echo "executing git push ..."
    git push
}


