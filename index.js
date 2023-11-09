$(function () {
    // Step 2: Get the JSON array from '/quizzes/list.php'
    $.getJSON('/quizzes/list.php', function (data) {
        // Step 3: For each entry, add an <a> and <br> element to the body
        $.each(data, function (index, entry) {
            console.log(entry);
            var $a = $('<a>', {
                href: `quiz.html?quiz=${entry}`,
                text: entry
            });
            $('body').append($a, $('<br>'));
        });
    });
});
