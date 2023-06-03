<div id="banner">
    <div>
        <div class="left">WYSIWYG</div>
        <div class="right">
            <button id="user">
                <?= $session["username"][0] ?>
                <div>
                    <div class="hoverMenu">
                        <a href="/portal/logout" id="logout">Log out</a>
                    </div>
                </div>
            </button>
        </div>
    </div>
</div>