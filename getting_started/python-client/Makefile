runproject:
	terminusdb commit
	terminusdb importcsv Employees.csv --classname EmployeesFromCSV --id "Employee id" -e Manager -m "Import Employees from CSV"
	python insert_data.py
	python update_data.py
	terminusdb branch contractors
	python add_contractors.py
