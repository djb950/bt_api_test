var top_lvl_count = 0;

function fetch_sub_urls(urls) {
  for (var i = 0; i < urls.length; i++) {
    let url = JSON.parse(urls[i]);
    if (urls[i].includes("repos")) {
      url += "?per_page=100";
    }

    $.getJSON(url, function(data, status, xhr) {
      var id = "not_found";

      if (url.includes("repos")) {
        if (data.length === top_lvl_count) {
          $("#repo_count").append(
            "<li>Public Repos: " +
              top_lvl_count +
              " Actual repo count: " +
              data.length +
              " <i class='fas fa-thumbs-up'></i></li>"
          );
        } else {
          $("#repo_count").append(
            "<li>Public Repos: " +
              top_lvl_count +
              " Actual repo count: " +
              data.length +
              " <i class='fas fa-thumbs-down'></i></li>"
          );
        }
      }

      if (data.id) {
        var id = data.id;
      } else {
        var id = data[0].id;
      }

      $("#items").append(
        "<li>URL: <a href=" + url + ">" + url + "</a> ID: " + id + "</li>"
      );
    }).catch(function(error) {
      $("#items").append(
        "<li>URL: <a href=" + url + ">" + url + "</a> ID: Not Found</li>"
      );
    });
  }
}

$(document).ready(function() {
  var sub_urls = [];
  const url = "https://api.github.com/orgs/boomtownroi";
  $.getJSON(url, function(data, status) {
    var response = data;
    var stat = status;

    top_lvl_count = data.public_repos;

    var updated_at = parseInt(data.updated_at);
    var created_at = parseInt(data.created_at);

    if (updated_at && created_at) {
      if (updated_at - created_at > 0) {
        // updated is later than created
        $("#v_items").append(
          "<li>Updated: " +
            data.updated_at +
            " Created: " +
            data.created_at +
            " <i class='fas fa-thumbs-up'></i></li>"
        );
      } else {
        // updated is same year or earlier than created; additional integer parsing is necessary for updates in the same year
        $("#v_items").append(
          "<li>Updated: " +
            data.updated_at +
            " Created: " +
            data.created_at +
            " <i class='fas fa-thumbs-down'></i></li>"
        );
      }
    }

    for (var key in response) {
      if (response.hasOwnProperty(key)) {
        // console.log(response[key]);
        var str = JSON.stringify(response[key]);
        // console.log(str);
        if (str.includes("api.github.com/orgs/BoomTownROI")) {
          //   console.log("includes sub url");
          sub_urls.push(str);
        }
      }
    }

    if (sub_urls.length > 0) {
      fetch_sub_urls(sub_urls);
    }
    // console.log(response);
    // console.log(stat);
  });
});
