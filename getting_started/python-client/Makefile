runproject:
	tdbpy commit
	tdbpy importcsv Employees.csv --classname EmployeesFromCSV --id "Employee id" -e Manager -m "Import Employees from CSV"
	python insert_data.py
	python update_data.py
	tdbpy branch contractors
	python add_contractors.py
