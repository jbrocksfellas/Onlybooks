# Generated by Django 3.2 on 2021-05-15 21:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('store', '0003_auto_20210516_0244'),
    ]

    operations = [
        migrations.AlterField(
            model_name='product',
            name='content',
            field=models.TextField(null=True),
        ),
    ]
