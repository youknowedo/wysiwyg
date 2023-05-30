<?php

// Get the slug from the path
$slug = str_replace("/portal/edit/", "", $path);

// Get the MySQL connection
$connection = require __DIR__ . "/../db.php";

if ($_SERVER['REQUEST_METHOD'] == "POST") {
    // Get the new page from the request body
    $newPage = file_get_contents('php://input');

    if (
        !$connection->query("UPDATE w_pages
                        SET html='" . $newPage . "'
                        WHERE slug='" . $slug . "' 
                        ")
    ) {
        http_response_code(500);
        echo $connection->error . "  [" . $connection->errno . "]";
    }
    exit;
}

// Get the page from the database
$r = $connection->query("SELECT * FROM w_pages WHERE slug='" . $slug . "'");
$page = $r->fetch_assoc();

// If the page was not found in the database, return 404
if ($page == null) {
    include __DIR__ . "/../404.php";
    http_response_code(404);
    exit;
}
?>

<div id="banner">
    <div>
        <div id="tools">
            <div class="left">
                <a href="/portal/pages">Back to portal</a>
            </div>
            <div class="right">
                <a href="/<?= $slug ?>">View</a>
                <button id="saveButton">Sav</button>
            </div>
        </div>
        <div id="modeSelector">
            <div class="horizontalMenu">
                <div class="highlight"></div>
                <button class="selected">
                    <svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 -960 960 960" width="16">
                        <path
                            d="m152-145-23-7q-32-14-43.5-48t6.5-67l60-136v258Zm186 78q-34 0-58-24t-24-58v-207l92 262q2 8 6 14t10 13h-26Zm188-24q-21 9-44-4t-33-36L258-650q-10-23 2-45t37-32l318-115q23-8 45 4t32 36l191 513q7 25-3 49t-35 33L526-91Zm-82-495q12 0 21-9t9-21q0-12-9-21t-21-9q-12 0-21 9t-9 21q0 12 9 21t21 9Z" />
                    </svg>
                </button>
                <button>
                    <svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 -960 960 960" width="16">
                        <path xmlns="http://www.w3.org/2000/svg"
                            d="M427-120v-225h60v83h353v60H487v82h-60Zm-307-82v-60h247v60H120Zm187-166v-82H120v-60h187v-84h60v226h-60Zm120-82v-60h413v60H427Zm166-165v-225h60v82h187v60H653v83h-60Zm-473-83v-60h413v60H120Z" />
                    </svg>
                </button>
            </div>
        </div>
    </div>
</div>

<script type="module" src="/src/portal/edit.js"></script>

<div id="editor">
    <div class="left menu">
        <div class="toolbar">
            <?= $page["slug"] ?>
            <button id="newButton">
                <svg xmlns="http://www.w3.org/2000/svg" height="14" viewBox="0 96 960 960" width="14">
                    <path d="M450 856V606H200v-60h250V296h60v250h250v60H510v250h-60Z"></path>
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" class="arrow" height="4" viewBox="0 96 960 960" width="4">
                    <path d="m40 917 441-704 439 704H40Z"></path>
                </svg>
                <div>
                    <div class="hoverMenu">
                        <span id="container">container</span>
                        <span id="text">text</span>
                    </div>
                </div>
            </button>
        </div>

        <div id="elements">

        </div>
    </div>

    <div>
        <!-- Create an iframe with the page HTML -->
        <iframe id="page" srcdoc="<html><body><?php echo htmlspecialchars($page["html"]); ?></body></html>">
        </iframe>
    </div>

    <div class="right menu">
        <div id="stylesInspector">
            <div id="layout" class="group">
                <h1>Layout</h1>
                <div class="subgroup">
                    <h2>Flex Items</h2>
                    <div id="direction" class="item">
                        <span class="label">Direction</span>
                        <div class="input">
                            <div class="horizontalMenu">
                                <div class="highlight"></div>
                                <button class="selected">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="12" viewBox="0 96 960 960"
                                        width="12">
                                        <path
                                            d="M480 973q-12 0-24-5t-22-15L212 731q-19-19-19-46.5t19-45.5q18-18 44.5-18t44.5 18l114 113V208q0-26 19.5-45t45.5-19q26 0 45.5 19.5T545 209v543l113-113q19-19 45.5-18.5T748 639q19 19 19 46t-19 46L526 953q-10 10-22 15t-24 5Z" />
                                    </svg>
                                </button>
                                <button>
                                    <svg xmlns="http://www.w3.org/2000/svg" height="12" viewBox="0 96 960 960"
                                        width="12">
                                        <path
                                            d="M552 844q-19-19-19-45.5t19-45.5l111-112H122q-26 0-45.5-19.5T57 576q0-26 19.5-45.5T122 511h541L552 399q-19-19-18.5-45.5T553 308q19-19 45-19t45 19l222 221q10 10 15.5 22.5T886 576q0 12-5 24t-15 22L643 845q-19 19-45.5 19T552 844Z" />
                                    </svg>
                                </button>
                            </div>
                            <button id="directionInvert">
                                <svg xmlns="http://www.w3.org/2000/svg" height="12" viewBox="0 96 960 960" width="12">
                                    <path
                                        d="M216 974q-54.65 0-92.325-37.675Q86 898.65 86 844V312q0-54.65 37.675-92.325Q161.35 182 216 182h68q26 0 45.5 19.5T349 247q0 26-19.5 45.5T284 312h-68v532h68q26 0 45.5 19.5T349 909q0 26-19.5 45.5T284 974h-68Zm267 73q-26 0-45.5-19.5T418 982.082V169.918Q418 144 437.5 124.5T483 105q26 0 45.5 19.5t19.5 45.418v812.164q0 25.918-19.5 45.418T483 1047Zm261-735V182q54.65 0 92.325 37.675Q874 257.35 874 312H744Zm0 309v-86h130v86H744Zm0 353V844h130q0 55-37.675 92.5T744 974Zm0-508v-86h130v86H744Zm0 310v-86h130v86H744ZM617 974V844h58v130h-58Zm0-662V182h58v130h-58Z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div id="align" class="item">
                        <span class="label">Align</span>
                        <div class="input">
                            <div class="horizontalMenu">
                                <div class="highlight"></div>
                                <button class="selected">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="12" viewBox="0 96 960 960"
                                        width="12">
                                        <path
                                            d="M111 1010q-26 0-45.5-19.5T46 945.09V206.91Q46 181 65.5 161.5 85 142 111 142t45.5 19.5Q176 181 176 206.91v738.18q0 25.91-19.5 45.41Q137 1010 111 1010Zm230-497q-35.417 0-60.208-24.826Q256 463.348 256 427.882q0-35.465 24.792-60.174Q305.583 343 341 343h488q35.417 0 60.208 24.826Q914 392.652 914 428.118q0 35.465-24.792 60.174Q864.417 513 829 513H341Zm0 296q-35.417 0-60.208-24.826Q256 759.348 256 723.882q0-35.465 24.792-60.174Q305.583 639 341 639h248q35.417 0 60.208 24.826Q674 688.652 674 724.118q0 35.465-24.792 60.174Q624.417 809 589 809H341Z" />
                                    </svg>
                                </button>
                                <button>
                                    <svg xmlns="http://www.w3.org/2000/svg" height="12" viewBox="0 96 960 960"
                                        width="12">
                                        <path
                                            d="M480 1010q-26 0-45.5-19.5T415 945.384V809H291q-35.417 0-60.208-24.826Q206 759.348 206 723.882q0-35.465 24.792-60.174Q255.583 639 291 639h124V513H171q-35.417 0-60.208-24.826Q86 463.348 86 427.882q0-35.465 24.792-60.174Q135.583 343 171 343h244V206.616Q415 181 434.5 161.5T480 142q26 0 45.5 19.5t19.5 45.116V343h244q35.417 0 60.208 24.826Q874 392.652 874 428.118q0 35.465-24.792 60.174Q824.417 513 789 513H545v126h124q35.417 0 60.208 24.826Q754 688.652 754 724.118q0 35.465-24.792 60.174Q704.417 809 669 809H545v136.384Q545 971 525.5 990.5T480 1010Z" />
                                    </svg>
                                </button>
                                <button>
                                    <svg xmlns="http://www.w3.org/2000/svg" height="12" viewBox="0 96 960 960"
                                        width="12">
                                        <path
                                            d="M849 1010q-26 0-45.5-19.5T784 945.09V206.91q0-25.91 19.5-45.41Q823 142 849 142t45.5 19.5Q914 181 914 206.91v738.18q0 25.91-19.5 45.41Q875 1010 849 1010ZM131 513q-35.417 0-60.208-24.826Q46 463.348 46 427.882q0-35.465 24.792-60.174Q95.583 343 131 343h488q35.417 0 60.208 24.826Q704 392.652 704 428.118q0 35.465-24.792 60.174Q654.417 513 619 513H131Zm240 296q-35.417 0-60.208-24.826Q286 759.348 286 723.882q0-35.465 24.792-60.174Q335.583 639 371 639h248q35.417 0 60.208 24.826Q704 688.652 704 724.118q0 35.465-24.792 60.174Q654.417 809 619 809H371Z" />
                                    </svg>
                                </button>
                                <button>
                                    <svg xmlns="http://www.w3.org/2000/svg" height="12" viewBox="0 96 960 960"
                                        width="12">
                                        <path
                                            d="M324 815q-24.3 0-41.65-17.35Q265 780.3 265 756V372q0-24.3 17.35-41.65Q299.7 313 324 313h24q24.3 0 41.65 17.35Q407 347.7 407 372v384q0 24.3-17.35 41.65Q372.3 815 348 815h-24Zm288 0q-24.3 0-41.65-17.35Q553 780.3 553 756V372q0-24.3 17.35-41.65Q587.7 313 612 313h24q24.3 0 41.65 17.35Q695 347.7 695 372v384q0 24.3-17.35 41.65Q660.3 815 636 815h-24ZM121 994q-24.3 0-41.65-17.289Q62 959.421 62 935.211 62 911 79.35 893.5T121 876h718q24.3 0 41.65 17.289 17.35 17.29 17.35 41.5Q898 959 880.65 976.5T839 994H121Zm0-718q-24.3 0-41.65-17.289Q62 241.421 62 217.211 62 193 79.35 175.5T121 158h718q24.3 0 41.65 17.289 17.35 17.29 17.35 41.5Q898 241 880.65 258.5T839 276H121Z" />
                                    </svg>
                                </button>
                                <button>
                                    <svg xmlns="http://www.w3.org/2000/svg" height="12" viewBox="0 96 960 960"
                                        width="12">
                                        <path xmlns="http://www.w3.org/2000/svg"
                                            d="M849.825 976Q837 976 828.5 967.375T820 946V766h-70q-12.75 0-21.375-8.625T720 736V416q0-12.75 8.625-21.375T750 386h70V206q0-12.75 8.675-21.375 8.676-8.625 21.5-8.625 12.825 0 21.325 8.625T880 206v740q0 12.75-8.675 21.375-8.676 8.625-21.5 8.625Zm-740 0Q97 976 88.5 967.375T80 946V206q0-12.75 8.675-21.375 8.676-8.625 21.5-8.625 12.825 0 21.325 8.625T140 206v180h70q12.75 0 21.375 8.625T240 416v320q0 12.75-8.625 21.375T210 766h-70v180q0 12.75-8.675 21.375-8.676 8.625-21.5 8.625Z" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                    </div>
                    <div id="justify" class="item">
                        <span class="label">Justify</span>
                        <div class="input">
                            <div class="horizontalMenu">
                                <div class="highlight"></div>
                                <button class="selected">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="12" viewBox="0 96 960 960"
                                        width="12">
                                        <path
                                            d="M110.91 272Q85 272 65.5 252.5 46 233 46 207t19.5-45.5Q85 142 110.91 142h738.18q25.91 0 45.41 19.5Q914 181 914 207t-19.5 45.5Q875 272 849.09 272H110.91Zm220.972 738q-35.465 0-60.174-24.792Q247 960.417 247 925V437q0-35.417 24.826-60.208Q296.652 352 332.118 352q35.465 0 60.174 24.792Q417 401.583 417 437v488q0 35.417-24.826 60.208Q367.348 1010 331.882 1010Zm296-240q-35.465 0-60.174-24.792Q543 720.417 543 685V437q0-35.417 24.826-60.208Q592.652 352 628.118 352q35.465 0 60.174 24.792Q713 401.583 713 437v248q0 35.417-24.826 60.208Q663.348 770 627.882 770Z" />
                                    </svg>
                                </button>
                                <button>
                                    <svg xmlns="http://www.w3.org/2000/svg" height="12" viewBox="0 96 960 960"
                                        width="12">
                                        <path
                                            d="M331.882 970q-35.465 0-60.174-24.792Q247 920.417 247 885V641H110.616Q85 641 65.5 621.5T46 576q0-26 19.5-45.5t45.116-19.5H247V267q0-35.417 24.826-60.208Q296.652 182 332.118 182q35.465 0 60.174 24.792Q417 231.583 417 267v244h126V387q0-35.417 24.826-60.208Q592.652 302 628.118 302q35.465 0 60.174 24.792Q713 351.583 713 387v124h136.384Q875 511 894.5 530.5T914 576q0 26-19.5 45.5T849.384 641H713v124q0 35.417-24.826 60.208Q663.348 850 627.882 850q-35.465 0-60.174-24.792Q543 800.417 543 765V641H417v244q0 35.417-24.826 60.208Q367.348 970 331.882 970Z" />
                                    </svg>
                                </button>
                                <button>
                                    <svg xmlns="http://www.w3.org/2000/svg" height="12" viewBox="0 96 960 960"
                                        width="12">
                                        <path
                                            d="M110.91 1010Q85 1010 65.5 990.5 46 971 46 945t19.5-45.5Q85 880 110.91 880h738.18q25.91 0 45.41 19.5Q914 919 914 945t-19.5 45.5Q875 1010 849.09 1010H110.91Zm220.972-206q-35.465 0-60.174-24.792Q247 754.417 247 719V227q0-35.417 24.826-60.208Q296.652 142 332.118 142q35.465 0 60.174 24.792Q417 191.583 417 227v492q0 35.417-24.826 60.208Q367.348 804 331.882 804Zm296 0q-35.465 0-60.174-24.792Q543 754.417 543 719V467q0-35.417 24.826-60.208Q592.652 382 628.118 382q35.465 0 60.174 24.792Q713 431.583 713 467v252q0 35.417-24.826 60.208Q663.348 804 627.882 804Z" />
                                    </svg>
                                </button>
                                <button>
                                    <svg xmlns="http://www.w3.org/2000/svg" height="12" viewBox="0 96 960 960"
                                        width="12">
                                        <path
                                            d="M324 815q-24.3 0-41.65-17.35Q265 780.3 265 756V372q0-24.3 17.35-41.65Q299.7 313 324 313h24q24.3 0 41.65 17.35Q407 347.7 407 372v384q0 24.3-17.35 41.65Q372.3 815 348 815h-24Zm288 0q-24.3 0-41.65-17.35Q553 780.3 553 756V372q0-24.3 17.35-41.65Q587.7 313 612 313h24q24.3 0 41.65 17.35Q695 347.7 695 372v384q0 24.3-17.35 41.65Q660.3 815 636 815h-24ZM121 994q-24.3 0-41.65-17.289Q62 959.421 62 935.211 62 911 79.35 893.5T121 876h718q24.3 0 41.65 17.289 17.35 17.29 17.35 41.5Q898 959 880.65 976.5T839 994H121Zm0-718q-24.3 0-41.65-17.289Q62 241.421 62 217.211 62 193 79.35 175.5T121 158h718q24.3 0 41.65 17.289 17.35 17.29 17.35 41.5Q898 241 880.65 258.5T839 276H121Z" />
                                    </svg>
                                </button>
                                <button>
                                    <svg xmlns="http://www.w3.org/2000/svg" height="12" viewBox="0 96 960 960"
                                        width="12">
                                        <path xmlns="http://www.w3.org/2000/svg"
                                            d="M110 976q-12.75 0-21.375-8.675Q80 958.649 80 945.825 80 933 88.625 924.5T110 916h180v-70q0-12.75 8.625-21.375T320 816h320q12.75 0 21.375 8.625T670 846v70h180q12.75 0 21.375 8.675 8.625 8.676 8.625 21.5 0 12.825-8.625 21.325T850 976H110Zm210-640q-12.75 0-21.375-8.625T290 306v-70H110q-12.75 0-21.375-8.675Q80 218.649 80 205.825 80 193 88.625 184.5T110 176h740q12.75 0 21.375 8.675 8.625 8.676 8.625 21.5 0 12.825-8.625 21.325T850 236H670v70q0 12.75-8.625 21.375T640 336H320Z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>