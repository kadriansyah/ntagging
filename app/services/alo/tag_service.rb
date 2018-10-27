
class Alo::TagService
    def create_tag(tag_form)
        tag_form.save
    end

    def update_tag(tag_form)
        tag_form.update
    end

    def delete_tag(id)
        tag = find_tag(id)
        return tag.delete, Alo::Tag.page(1).total_pages
    end

    def find_tag(id)
        Alo::Tag.find(id)
    end

    def find_tags(page = 0)
        return Alo::Tag.page(page), Alo::Tag.page(1).total_pages
    end
end
