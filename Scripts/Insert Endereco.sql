SELECT TOP (1000) [ID]
      ,[CEP]
      ,[Logradouro]
      ,[Numero]
      ,[Longitude]
      ,[Latitude]
      ,[Cidade]
  FROM [VitalHub_G09M].[dbo].[Enderecos]


  insert into Enderecos values 
	(NEWID(),'09760-280','Av. Armando �talo Setti',402,-23.6982, -46.5473,'S�o Bernardo do Campo'),
	(NEWID(),'04262-000','Av. Nazar�',28,-23.5842, -46.6116,'S�o Paulo'),
	(NEWID(),'09270-410','R. Am�rica do Sul',285,-23.6341, -46.4998,'Santo Andr�') 