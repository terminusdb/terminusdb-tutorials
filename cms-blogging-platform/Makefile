all:
	terminusdb db create admin/blog
	terminusdb doc insert admin/blog -g schema -f < schema.json
	terminusdb doc insert admin/blog < data.json
	python create_from_files.py
	terminusdb doc insert admin/blog < blogs.json

clean:
	terminusdb db delete admin/blog
