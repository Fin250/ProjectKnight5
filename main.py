from flask import (
    Flask,
    render_template,
    request,
)
import feedparser
import random


app = Flask(__name__)

# Routes
@app.route("/")
def home():
    return render_template("home.html")

@app.route("/menopause-support")
def menopause_support():
    return render_template("menopause_support.html")

@app.route("/menstrual-cycle-awareness")
def menstrual_cycle_awareness():
    return render_template("menstrual_cycle_awareness.html")

@app.route("/tarot")
def tarot():
    return render_template("tarot.html")

@app.route("/yoga")
def yoga():
    return render_template("yoga.html")

@app.route("/events")
def events():
    return render_template("events.html")

@app.route("/bookings")
def bookings():
    return render_template("bookings.html")

@app.route("/about")
def about():
    return render_template("about.html")

BLOG_FEED_URL = "https://lisalunamoth.substack.com/feed"  # Blog RSS

@app.route("/blog")
def blog():
    feed = feedparser.parse(BLOG_FEED_URL)
    all_posts = []
    placeholder_images = [
        "/static/images/placeholders/placeholder1.png",
        "/static/images/placeholders/placeholder2.jpg",
        "/static/images/placeholders/placeholder3.jpg",
        "/static/images/placeholders/placeholder4.jpg",
        "/static/images/placeholders/placeholder5.jpg",
    ]

    for entry in feed.entries:
        image_url = None
        if "media_content" in entry:
            image_url = entry.media_content[0]["url"]

        all_posts.append({
            "title": entry.title,
            "link": entry.link,
            "published": entry.published,
            "excerpt": entry.summary,
            "image": image_url
        })

    posts_per_page = 5
    page = request.args.get("page", 1, type=int)
    total_posts = len(all_posts)
    start = (page - 1) * posts_per_page
    end = start + posts_per_page
    posts = all_posts[start:end]
    total_pages = (total_posts + posts_per_page - 1) // posts_per_page

    random_start_index = random.randint(0, len(placeholder_images) - 1)

    for i, post in enumerate(posts):
        if not post["image"]:
            post["image"] = placeholder_images[(random_start_index + i) % len(placeholder_images)]

    return render_template("blog.html", posts=posts, page=page, total_pages=total_pages)

@app.errorhandler(404)
def page_not_found(error):
    return render_template("404.html"), 404


# Run app
if __name__ == "__main__":
    app.run(debug=True)